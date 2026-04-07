from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.all import TransactionType, GoalCategory

# User Schemas
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    monthly_salary: float

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    type: TransactionType
    category: str
    description: Optional[str] = None
    date: datetime = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Goal Schemas
class GoalBase(BaseModel):
    name: str
    category: GoalCategory
    target_amount: float
    target_date: datetime

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    user_id: int
    current_amount: float

    class Config:
        from_attributes = True

# AI Chat Schema
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# Budget Schema
class BudgetAllocation(BaseModel):
    needs_limit: float
    needs_spent: float
    wants_limit: float
    wants_spent: float
    savings_limit: float
    savings_spent: float

# Investment Schemas
class InvestmentAllocation(BaseModel):
    category: str
    amount: float
    instruments: List[str]
    reason: str

class InvestmentProfile(BaseModel):
    total_savings: float
    allocations: List[InvestmentAllocation]
    disclaimer: str = "This is AI-based guidance, not financial advice."
