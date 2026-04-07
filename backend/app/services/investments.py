from sqlalchemy.orm import Session
from app.models.all import User, Goal, GoalCategory
from pydantic import BaseModel
from typing import List, Dict

class InvestmentAllocation(BaseModel):
    category: str
    amount: float
    instruments: List[str]
    reason: str

class InvestmentProfile(BaseModel):
    total_savings: float
    allocations: List[InvestmentAllocation]
    disclaimer: str = "This is AI-based guidance, not financial advice."

def calculate_investments(db: Session, user_id: int, monthly_savings: float) -> InvestmentProfile:
    user = db.query(User).filter(User.id == user_id).first()
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    
    risk = user.risk_profile.lower() if user else "moderate"
    age = user.age if user else 25
    
    # 📊 1. Allocation Strategy based on Risk and Goals
    allocations = []
    
    # Identify key goals
    has_house_goal = any(g.category == GoalCategory.HOUSE for g in goals)
    has_parents_goal = any(g.category == GoalCategory.PARENTS for g in goals)
    
    # Calculation Logic (simplified for simulation)
    # Default: Balanced Split (30% Safe, 40% Moderate, 20% High, 10% Traditional)
    
    # adjust based on risk
    if risk == "conservative":
        p_safe, p_mod, p_high, p_trad = 0.60, 0.25, 0.05, 0.10
    elif risk == "aggressive":
        p_safe, p_mod, p_high, p_trad = 0.15, 0.35, 0.40, 0.10
    else: # moderate
        p_safe, p_mod, p_high, p_trad = 0.30, 0.40, 0.20, 0.10

    # Adjust based on goals
    if has_house_goal:
        p_mod += 0.05 # Growth
        p_safe -= 0.05
    if has_parents_goal:
        p_safe += 0.10 # Stability
        p_mod -= 0.10

    # Ensure total = 1.0 (normalization)
    total_p = p_safe + p_mod + p_high + p_trad
    p_safe, p_mod, p_high, p_trad = p_safe/total_p, p_mod/total_p, p_high/total_p, p_trad/total_p
    
    # 🏦 Safe / Low Risk
    safe_amt = monthly_savings * p_safe
    if safe_amt > 0:
        allocations.append(InvestmentAllocation(
            category="Safe / Low Risk",
            amount=safe_amt,
            instruments=["Fixed Deposits (FD)", "PPF", "Government Bonds"],
            reason="Best for your emergency fund and parental security."
        ))
        
    # 📈 Moderate Risk
    mod_amt = monthly_savings * p_mod
    if mod_amt > 0:
        allocations.append(InvestmentAllocation(
            category="Moderate Risk",
            amount=mod_amt,
            instruments=["Mutual Funds (SIP)", "Index Funds", "Hybrid Funds"],
            reason="Ideal for long-term growth for your dream house."
        ))
        
    # 🚀 High Risk / High Return
    high_amt = monthly_savings * p_high
    if high_amt > 0:
        allocations.append(InvestmentAllocation(
            category="High Risk & Return",
            amount=high_amt,
            instruments=["Diversified Stocks", "Blue chip Equity"],
            reason=f"Since you are {age}, you can afford this exposure for wealth creation."
        ))
        
    # 🪙 Traditional / Emotional
    trad_amt = monthly_savings * p_trad
    if trad_amt > 0:
        allocations.append(InvestmentAllocation(
            category="Traditional Asset",
            amount=trad_amt,
            instruments=["Gold (SGB)", "Real Estate"],
            reason="Inflation hedge and emotional asset stability."
        ))
        
    return InvestmentProfile(total_savings=monthly_savings, allocations=allocations)
