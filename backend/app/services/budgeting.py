from sqlalchemy.orm import Session
from app.models.all import User, Transaction, Goal, TransactionType
from app.schemas.all import BudgetAllocation
from datetime import datetime, timedelta

def calculate_budget(db: Session, user_id: int) -> BudgetAllocation:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    
    salary = user.monthly_salary
    now = datetime.utcnow()

    # 1. Calculate Required Savings based on Goals
    goals = db.query(Goal).filter(Goal.user_id == user_id, Goal.current_amount < Goal.target_amount).all()
    total_required_monthly_savings = 0.0

    for goal in goals:
        if goal.target_date > now:
            months_remaining = (goal.target_date.year - now.year) * 12 + (goal.target_date.month - now.month)
            if months_remaining <= 0:
                months_remaining = 1 # At least 1 month if it's very close
            
            remaining_amount = goal.target_amount - goal.current_amount
            required_monthly = remaining_amount / months_remaining
            total_required_monthly_savings += required_monthly

    # 2. Adjust Allocation (Standard is 50/30/20)
    # Default percentages
    p_needs = 0.50
    p_wants = 0.30
    p_savings = 0.20

    # Required savings percentage
    required_s_p = total_required_monthly_savings / salary if salary > 0 else 0

    if required_s_p > p_savings:
        # Need to increase savings, take from wants first
        extra_needed = required_s_p - p_savings
        can_take_from_wants = min(extra_needed, p_wants - 0.10) # Keep at least 10% for wants if possible
        p_wants -= can_take_from_wants
        p_savings += can_take_from_wants
        
        extra_needed -= can_take_from_wants
        if extra_needed > 0:
            # Still need more, take from needs (dangerous but requested by goals)
            can_take_from_needs = min(extra_needed, p_needs - 0.30) # Keep at least 30% for needs
            p_needs -= can_take_from_needs
            p_savings += can_take_from_needs

    needs_limit = salary * p_needs
    wants_limit = salary * p_wants
    savings_limit = salary * p_savings

    # Calculate spent so far this month
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == TransactionType.EXPENSE,
        Transaction.date >= start_of_month
    ).all()

    needs_spent = sum(t.amount for t in transactions if t.category in ["Food", "Rent", "Bills"])
    wants_spent = sum(t.amount for t in transactions if t.category in ["Shopping", "Entertainment", "Dining Out"])
    savings_spent = sum(t.amount for t in transactions if t.category in ["Investment", "Goal Contribution"])

    return BudgetAllocation(
        needs_limit=needs_limit,
        needs_spent=needs_spent,
        wants_limit=wants_limit,
        wants_spent=wants_spent,
        savings_limit=savings_limit,
        savings_spent=savings_spent
    )
