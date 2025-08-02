from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from base import SessionLocal, engine
import material
import schemas

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

@app.get("/")
async def __app__():
    return "Just string"

@app.get("/materials", response_model=list[schemas.MaterialRead])
async def get_materials(db: Session = Depends(get_db)):
    return db.query(material.Material).all()

@app.get("/materials/{item_id}", response_model=schemas.MaterialRead)
async def get_byid_material(item_id: int, db: Session = Depends(get_db)):
    res = db.query(material.Material).get(item_id)

    return res

@app.post("/materials", response_model=schemas.MaterialRead)
async def get_byid_material(body: schemas.MaterialCreate, db: Session = Depends(get_db)):
    db_material = material.Material(title=body.title, type=body.type, tag=body.tag, link=body.link, status=body.status)
    db.add(db_material)
    db.commit()
    db.refresh(db_material)

    return db_material