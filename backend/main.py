from fastapi import FastAPI, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os

from app.core.database import SessionLocal, engine, Base, get_db
from app.models.all import User, Transaction, Goal
from app.schemas.all import UserCreate, User as UserSchema, TransactionCreate, Transaction as TransactionSchema, GoalCreate, Goal as GoalSchema, ChatRequest, ChatResponse, BudgetAllocation, InvestmentProfile
from app.services.budgeting import calculate_budget
from app.services.investments import calculate_investments
from app.services.textract import textract_service
from app.services.tax import tax_advisor



Base.metadata.create_all(bind=engine)

import os

app = FastAPI(title="Personal CA Bot API")

# Setup CORS for production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/tax-advice")
def get_tax_advice(db: Session = Depends(get_db)):
    # Simple advice for now; we could base it on salary
    advice = tax_advisor.analyze_document_and_suggest("", "general")
    return {"advice": advice}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a payslip or bill and extracts information."""
    contents = await file.read()
    
    # Try extracting text
    extracted_text = textract_service.extract_text_from_bytes(contents)
    
    if "Error" in extracted_text:
        # Mock mode if AWS keys are missing
        if os.getenv("AWS_ACCESS_KEY_ID") is None:
             # Just return a helpful mock response if no keys exist for easy dev
             return {
                 "filename": file.filename,
                 "analysis": ["Mock Analysis: We found some potential ₹50,000 savings in 80C!", "Consider submitting your house rent receipts."],
                 "extracted": "Sample data: Salary 50000, Needs Rent 15000, Entertainment 5000"
             }
        raise HTTPException(status_code=500, detail=extracted_text)
        
    analysis = tax_advisor.analyze_document_and_suggest(extracted_text, "payslip")
    
    return {
        "filename": file.filename,
        "analysis": analysis,
        "extracted": extracted_text[:500] + "..." # Limit large text
    }


# Mock user for simplicity (In a real app, use JWT Auth)
CURRENT_USER_ID = 1

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    user = db.query(User).filter(User.id == CURRENT_USER_ID).first()
    if not user:
        new_user = User(id=CURRENT_USER_ID, email="test@test.com", name="Test User", hashed_password="fake", monthly_salary=100000.0)
        db.add(new_user)
        db.commit()
    db.close()

@app.get("/api/user", response_model=UserSchema)
def get_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == CURRENT_USER_ID).first()
    return user

@app.get("/api/budget", response_model=BudgetAllocation)
def get_budget(db: Session = Depends(get_db)):
    return calculate_budget(db, CURRENT_USER_ID)

@app.get("/api/investments", response_model=InvestmentProfile)
def get_investments(db: Session = Depends(get_db)):
    budget = calculate_budget(db, CURRENT_USER_ID)
    # Savings available to invest (assuming what's not spent from savings limit is available)
    savings_available = budget.savings_limit - budget.savings_spent
    return calculate_investments(db, CURRENT_USER_ID, max(0, savings_available))

@app.get("/api/goals", response_model=list[GoalSchema])
def get_goals(db: Session = Depends(get_db)):
    return db.query(Goal).filter(Goal.user_id == CURRENT_USER_ID).all()

@app.post("/api/goals", response_model=GoalSchema)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    db_goal = Goal(**goal.dict(), user_id=CURRENT_USER_ID)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.get("/api/transactions", response_model=list[TransactionSchema])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id == CURRENT_USER_ID).all()

@app.post("/api/transactions", response_model=TransactionSchema)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    import datetime
    if not transaction.date:
        transaction.date = datetime.datetime.utcnow()
    db_transaction = Transaction(**transaction.dict(), user_id=CURRENT_USER_ID)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    message = request.message.lower()
    
    # Fetch current state for analysis
    user = db.query(User).filter(User.id == CURRENT_USER_ID).first()
    budget = calculate_budget(db, CURRENT_USER_ID)
    goals = db.query(Goal).filter(Goal.user_id == CURRENT_USER_ID).all()
    
    # Logic for CA-like responses with personality
    if "calculate" in message or "budget" in message or "status" in message:
        needs_percent = (budget.needs_spent / budget.needs_limit) * 100 if budget.needs_limit > 0 else 0
        wants_percent = (budget.wants_spent / budget.wants_limit) * 100 if budget.wants_limit > 0 else 0
        
        if "swiggy" in message or "food" in message or "eat" in message:
            return ChatResponse(reply=f"Hey! 😅 looks like Food became your best friend this month. You've already used {needs_percent:.1f}% of your essentials budget. Maybe a home-cooked meal tonight?")

        reply = f"Hi {user.name}! 👋 Looking at your numbers: you've used {needs_percent:.1f}% of your 'Needs' and {wants_percent:.1f}% of your 'Wants'. "
        if wants_percent > 80:
            reply += "Warning: You're nearly at your limit for treats. Try focusing on your goals for the rest of the month! 🚀"
        else:
            reply += "Your spending is super healthy! You're doing a great job managing your money. 🌟"
            
    elif "invest" in message or "where" in message or "put" in message:
        # User is asking where exactly to put the money
        savings_available = budget.savings_limit - budget.savings_spent
        investments = calculate_investments(db, CURRENT_USER_ID, max(0, savings_available))
        
        reply = f"Since your risk profile is '{user.risk_profile}', here is your custom monthly allocation for your ₹{investments.total_savings:,.0f} savings:\n\n"
        for alloc in investments.allocations:
            reply += f"• ₹{alloc.amount:,.0f} in {alloc.category} ({', '.join(alloc.instruments[:2])})\n"
        
        reply += f"\n💡 *Why?* {investments.allocations[0].reason if investments.allocations else 'To grow your wealth safely.'}\n\n"
        reply += "_Disclaimer: This is AI guidance, not financial advice._"
            
    elif "goal" in message or "save" in message or "buy" in message:
        active_goals = [g for g in goals if g.current_amount < g.target_amount]
        if active_goals:
            g = active_goals[0]
            remaining = g.target_amount - g.current_amount
            reply = f"You're making great progress towards your '{g.name}'! 🏠 You still need ₹{remaining:,.0f}. Keep saving ₹{budget.savings_limit:,.0f} monthly to smash this goal by {g.target_date.strftime('%B %Y')}! You've got this! 💪"
        else:
            reply = "You've crushed all your goals! 🏆 Why not set a new one? Maybe a vacation or an early retirement fund?"
            
    else:
        reply = "I'm your AI CA! 🏦 I can help you with your budget, tell you exactly where to invest, or track your big goals. What should we look at?"

    return ChatResponse(reply=reply)
