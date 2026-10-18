# Backend & API Architectural Rules for ZAP (codezap.in)

## 1. Request Flow & Routing
- The frontend calls relative paths under `/api/*`.
- In local development, `next.config.ts` rewrites `/api/:path*` to `http://127.0.0.1:8000/api/:path*`.
- In production, `vercel.json` rewrites `/api/(.*)` to the Python serverless function `api/index.py`.
- **Always declare FastAPI routes with their full `/api/...` prefix** (e.g. `@router.post("/api/submissions")`), matching both Next.js dev rewrites and Vercel production rewrites verbatim.


## 2. Security & Code Execution
- **Never execute untrusted user code in the backend process.** All execution must be sent as outbound HTTP calls to the isolated Piston sandbox via `api/piston_service.py`.
- Enforce memory and execution time limits on all runs.

## 3. Data Integrity & Transactions
- **Soft Deletes**: Mark deleted problems as `archived` and cancelled contests as `cancelled`. Never delete historical contest rows directly.
- **Parent-Child Primary Keys**: Flush the parent row (`db.flush()`) before constructing child rows that rely on the parent's generated ID.
- **CamelCase Boundary**: Database columns are `snake_case`; API responses must be `camelCase`. Keep translations strictly in `schemas.py` and `serializers.py`.
