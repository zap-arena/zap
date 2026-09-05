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

token = create_access_token({"sub": "admin@local.dev", "role": "admin", "userId": "admin_id"}, timedelta(minutes=30))
import urllib.request
import urllib.error
import json

req = urllib.request.Request("http://127.0.0.1:8000/api/admin/statistics", headers={"Authorization": f"Bearer {token}"})
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(e)
