from pydantic import BaseModel

class MaterialBase(BaseModel):
    title: str
    type: str
    tag: str
    link: str
    status: str

class MaterialCreate(MaterialBase):
    pass

class MaterialRead(MaterialBase):
    id: int

    class Config:
        orm_mode = True