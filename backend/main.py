from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.api import router

app = FastAPI(title="TwinMind Live Suggestions API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Prefix matches frontend default API_URL (/api) and Vercel route /api/*
app.include_router(router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}

