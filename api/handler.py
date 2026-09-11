import sys
import os

api_dir = os.path.dirname(os.path.abspath(__file__))
vendor_dir = os.path.join(api_dir, "vendor")

if vendor_dir not in sys.path:
    sys.path.insert(0, vendor_dir)

from mangum import Mangum
from .index import app

handler = Mangum(app)