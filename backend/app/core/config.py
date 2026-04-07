from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Personal CA Bot"
    DATABASE_URL: str = "sqlite:///./ca_bot.db" # Defaulting to sqlite for easy local setup, can be overridden with Postgres URL
    OPENAI_API_KEY: str = ""
    SECRET_KEY: str = "your-secret-key-here" # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
