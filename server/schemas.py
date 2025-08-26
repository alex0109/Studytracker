from pydantic import BaseModel
from typing import Optional

class MaterialBase(BaseModel):
    title: str
    type: str
    tag: str
    link: str
    status: str

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    tag: Optional[int] = None
    link: Optional[str] = None
    status: Optional[str] = None

class MaterialRead(MaterialBase):
    id: int

    class Config:
        orm_mode = True