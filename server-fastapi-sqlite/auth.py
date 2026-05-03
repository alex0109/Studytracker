from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import settings
from uuid import UUID

project_settings = settings.Settings()
security = HTTPBearer()
JWT_SECRET = project_settings.jwt_secret
JWT_ALGORITHM = project_settings.jwt_algorithm

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    # try:
    #     payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM], audience="authenticated")
    #     user_id: UUID = payload.get("sub")

    #     if not user_id:
    #         print("Not user_id")
    #         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
    #     return user_id
    
    # except JWTError:
    #     print("Prosto pizda")
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate token")

    return True