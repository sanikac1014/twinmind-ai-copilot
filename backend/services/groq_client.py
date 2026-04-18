import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

# Load env reliably whether uvicorn starts from repo root or backend directory.
_BACKEND_ENV = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=_BACKEND_ENV, override=False)
load_dotenv(override=False)


def get_groq_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is missing in environment.")
    return Groq(api_key=api_key)

