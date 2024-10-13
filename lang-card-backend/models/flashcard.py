from pydantic import BaseModel
from typing import List, Optional


class Flashcard(BaseModel):
    term_native: str
    term_learning_language: str
    example_sentence_learning_language: str
    term_audio: Optional[str]
    sentence_audio: Optional[str]
    active: bool


class Flashcards(BaseModel):
    flashcards: List[Flashcard]
