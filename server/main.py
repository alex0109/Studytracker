from fastapi import FastAPI, Depends, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from base import SessionLocal, engine
import material, schemas
from auth import get_current_user

material.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @app.get("/")
# async def __app__():
#     return "Just string"

@app.get("/materials", response_model=list[schemas.MaterialRead])
async def get_materials(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    return db.query(material.Material).filter(material.Material.user_id == user_id).all()

@app.get("/materials/{item_id}", response_model=schemas.MaterialRead)
async def get_byid_material(item_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    res = db.query(material.Material).filter(material.Material.id == item_id, material.Material.user_id == user_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Material not found")

    return res

@app.post("/materials", response_model=schemas.MaterialRead)
async def get_byid_material(body: schemas.MaterialCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    db_material = material.Material(
        title=body.title, 
        type=body.type, 
        tag=body.tag, 
        link=body.link, 
        status=body.status, 
        description=body.description, 
        user_id=user_id
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)

    return db_material

@app.delete("/materials/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(item_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    material_to_delete = db.query(material.Material).filter(material.Material.id == item_id, material.Material.user_id == user_id).first()

    if not material_to_delete:
        raise HTTPException(status_code=404, detail="Material not found")
    
    db.delete(material_to_delete)
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.patch("/materials/{item_id}", response_model=schemas.MaterialRead)
def update_material(item_id: int, material_update: schemas.MaterialUpdate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    res = db.query(material.Material).filter(material.Material.id == item_id, material.Material.user_id == user_id).first()

    if not res:
        raise HTTPException(status_code=404, detail="Material not found")
    
    for field, value in material_update.model_dump(exclude_unset=True).items():
        setattr(res, field, value)

    db.commit()
    db.refresh(res)
    return res