import os
import sys
import jwt
from datetime import datetime, timedelta, timezone

sys.path.append('api')
SECRET_KEY = "dJBfsX3a_A1M9RV0z98f1dfypdrTFYR0fjPz_924ntTGj6veGpj_nSz2WcSPD28q"

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

token = create_access_token({"sub": "9e200484168d4d7e8a63a9dce5d6ce36", "role": "admin"}, timedelta(minutes=30))
import urllib.request
import urllib.error
import json

req = urllib.request.Request("http://127.0.0.1:8001/api/admin/statistics", headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(e)
