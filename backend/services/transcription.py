from fastapi import UploadFile

from backend.services.groq_client import get_groq_client

MODEL = "whisper-large-v3-turbo"


async def transcribe_audio(file: UploadFile) -> str:
    client = get_groq_client()
    content = await file.read()
    content_type = file.content_type or "audio/webm"
    transcription = client.audio.transcriptions.create(
        file=(file.filename or "chunk.webm", content, content_type),
        model=MODEL,
        response_format="verbose_json",
    )
    return transcription.text

