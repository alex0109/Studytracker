from pydantic import BaseModel
from typing import Optional, Union, Dict, List

class Node(BaseModel):
    type: str
    text: Optional[str] = None
    attrs: Optional[Dict[str, Union[str, int]]] = None
    content: Optional[List["Node"]] = None

Node.model_rebuild()

class Document(BaseModel):
    type: str
    content: List[Node]

class MaterialBase(BaseModel):
    title: str
    type: Optional[str] = None
    tags: Optional[List[str]] = None
    link: Optional[str] = None
    status: Optional[str] = None
    description: Optional[Union[str, Document]] = None

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[List[str]] = None
    link: Optional[str] = None
    status: Optional[str] = None
    description: Optional[Union[str, Document]] = None

class MaterialRead(MaterialBase):
    id: int
    user_id: str

    class Config:
        from_attributes = True