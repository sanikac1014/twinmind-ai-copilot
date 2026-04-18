"""Groq model selection. Default to lighter models to avoid TPD exhaustion on gpt-oss-120b."""

import os


def primary_model() -> str:
    return os.getenv("GROQ_MODEL_PRIMARY", "llama-3.3-70b-versatile")


def fallback_model() -> str:
    return os.getenv("GROQ_MODEL_FALLBACK", "llama-3.1-8b-instant")


def _is_rate_limit(exc: BaseException) -> bool:
    msg = str(exc).lower()
    return "429" in msg or "rate_limit" in msg or "tokens per day" in msg


def chat_with_fallback(client, messages: list, **kwargs):
    """Try primary model, then fallback on rate limit (429 / TPD)."""
    models = [primary_model(), fallback_model()]
    last_exc: BaseException | None = None
    for idx, model in enumerate(models):
        try:
            resp = client.chat.completions.create(model=model, messages=messages, **kwargs)
            if idx > 0:
                print(f"[GROQ] using fallback model {model}")
            return resp, model
        except BaseException as exc:
            last_exc = exc
            if _is_rate_limit(exc) and idx < len(models) - 1:
                print(f"[GROQ] {model} rate limited, retrying with {models[idx + 1]}")
                continue
            raise
    assert last_exc is not None
    raise last_exc
