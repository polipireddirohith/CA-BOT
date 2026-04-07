from app.core.database import SessionLocal, engine, Base
from app.models.all import User, Transaction, Goal, TransactionType, GoalCategory
import datetime

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Check if user exists
user = db.query(User).filter(User.id == 1).first()
if not user:
    user = User(id=1, email="test@test.com", name="Test User", hashed_password="fake", monthly_salary=100000.0, age=25, risk_profile="moderate")
    db.add(user)
    db.commit()

# Check if goals exist
if db.query(Goal).count() == 0:
    goals = [
        Goal(user_id=1, name="Dream House", category=GoalCategory.HOUSE, target_amount=5000000, current_amount=1200000, target_date=datetime.datetime(2030, 1, 1)),
        Goal(user_id=1, name="Sports Bike", category=GoalCategory.BIKE, target_amount=300000, current_amount=135000, target_date=datetime.datetime(2025, 12, 1)),
        Goal(user_id=1, name="Gold Investment", category=GoalCategory.GOLD, target_amount=200000, current_amount=200000, target_date=datetime.datetime(2024, 6, 1)), # completed
        Goal(user_id=1, name="Sedan Car", category=GoalCategory.CAR, target_amount=1500000, current_amount=250000, target_date=datetime.datetime(2027, 5, 1)),
    ]
    db.add_all(goals)

# Check if transactions exist
if db.query(Transaction).count() == 0:
    transactions = [
        Transaction(user_id=1, amount=15000, type=TransactionType.EXPENSE, category="Rent", description="Monthly Rent"),
        Transaction(user_id=1, amount=6000, type=TransactionType.EXPENSE, category="Food", description="Groceries"),
        Transaction(user_id=1, amount=12000, type=TransactionType.EXPENSE, category="Shopping", description="Clothes & Gadgets"),
        Transaction(user_id=1, amount=4000, type=TransactionType.EXPENSE, category="Entertainment", description="Movies"),
        Transaction(user_id=1, amount=20000, type=TransactionType.EXPENSE, category="Investment", description="Goal Save"),
    ]
    db.add_all(transactions)

db.commit()
db.close()
print("Mock seed data injected successfully.")
