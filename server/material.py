from sqlalchemy import Column, Integer, String
from base import Base

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False)
    type = Column(String)
    tag = Column(String)
    link = Column(String)
    status = Column(String)
    description = Column(String)
    user_id = Column(String, index=True, nullable=False)