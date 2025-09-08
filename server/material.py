from sqlalchemy import Column, Integer, String, JSON
from base import Base

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=True)
    tag = Column(String, nullable=True)
    link = Column(String, nullable=True)
    status = Column(String, nullable=True)
    description = Column(JSON, nullable=True)
    user_id = Column(String, index=True, nullable=False)