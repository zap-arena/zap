import sys
sys.path.append('api')
from database import SessionLocal
import models
from routers.admin import statistics

db = SessionLocal()
admin = db.query(models.User).filter_by(role="admin").first()
if not admin:
    admin = models.User(id="admin", role="admin")

try:
    res = statistics(db=db, _=admin)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
