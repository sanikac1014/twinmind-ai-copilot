from collections import deque
from dataclasses import dataclass, field
from typing import Deque, Dict, List, Optional

from backend.models.schemas import ChatMessage, ContextPayload, Suggestion, TranscriptEntry


@dataclass
class SessionState:
    transcript_entries: List[TranscriptEntry] = field(default_factory=list)
    chat_history: List[ChatMessage] = field(default_factory=list)
    # Each item: {"batch_id": int, "segment_id": int, "suggestions": List[Suggestion]}
    suggestion_history: Deque[Dict] = field(default_factory=lambda: deque(maxlen=80))
    rolling_summary: str = ""
    last_primary_focus: str = ""
    last_conversation_type: str = ""
    current_segment_id: int = 0
    latest_batch_id: int = 0
    last_context: Optional[ContextPayload] = None
    last_transcript_signature: str = ""
    session_segments: List[dict] = field(default_factory=list)


STATE = SessionState()
