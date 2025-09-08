from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    jwt_secret: str
    jwt_algorithm: str

    class Config:
        env_file = ".env"