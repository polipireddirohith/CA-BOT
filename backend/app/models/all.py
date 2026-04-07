from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import datetime
import enum

class TransactionType(str, enum.Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

class GoalCategory(str, enum.Enum):
    HOUSE = "HOUSE"
    CAR = "CAR"
    BIKE = "BIKE"
    GOLD = "GOLD"
    SCHOOL = "SCHOOL"
    PARENTS = "PARENTS"
    CUSTOM = "CUSTOM"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    monthly_salary = Column(Float, default=0.0)
    age = Column(Integer, default=25)
    risk_profile = Column(String, default="moderate") # conservative, moderate, aggressive
    
    transactions = relationship("Transaction", back_populates="user")
    goals = relationship("Goal", back_populates="user")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    type = Column(Enum(TransactionType))
    category = Column(String) # e.g., "Food", "Rent", "Salary"
    date = Column(DateTime, default=datetime.datetime.utcnow)
    description = Column(String, nullable=True)

    user = relationship("User", back_populates="transactions")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    category = Column(Enum(GoalCategory))
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    target_date = Column(DateTime)
    
    user = relationship("User", back_populates="goals")
