from pydantic import BaseModel
from typing import Optional

class MaterialBase(BaseModel):
    title: str
    type: Optional[str] = None
    tag: Optional[str] = None
    link: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    tag: Optional[str] = None
    link: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class MaterialRead(MaterialBase):
    id: int
    user_id: str

    class Config:
        orm_mode = True