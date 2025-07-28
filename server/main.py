from fastapi import FastAPI
from data import materials
from pydantic import BaseModel
import random

class MaterialModel(BaseModel):
    id: int
    title: str
    type: str
    tag: str
    link: str
    status: str


app = FastAPI()

@app.get("/")
async def __app__():
    return "Just string"

@app.get("/materials")
async def get_materials():
    return materials

@app.get("/materials/{item_id}")
async def get_byid_material(item_id: int):
    result = [item for item in materials if item["id"] == item_id]

    return result

@app.post("/materials")
async def get_byid_material(material: MaterialModel):
    material.id = random.randint(1, 1000)
    material_dict = material.model_dump()

    materials.append(material_dict)
    print(materials)

    return material