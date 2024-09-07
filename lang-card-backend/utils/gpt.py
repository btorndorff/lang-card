import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, Any, Optional
from pydantic import BaseModel
import logging

load_dotenv()

AUDIO_INPUT_SYSTEM_PROMPT = """
You are a language learning flashcard generator. Your task is to create flashcards from an inputted transcribed text in the language the user is learning. Extract as many unique vocabulary words from the text as possible. Exclude people's names. You may be prompted to include an example sentence using the new vocabulary word.

The user's input will be in the following format, where 'x' will be replaced with actual values:

- Native language: x
- Language being learned: x
- Flashcard format: x
- Transcribed text: x

Please output your response strictly using the Flashcard format provided by the user.
"""

TEXT_INPUT_SYSTEM_PROMPT = """
You are a language learning flashcard generator. Your task is to create flashcards from an inputted text from the user in the language the user is learning. Extract as many unique vocabulary words from the text as possible. Exclude people's names. You may be prompted to include an example sentence using the new vocabulary word. When generating example sentences ensure they are simple and emphasize the new vocabulary word.

The user's input will be in the following format, where 'x' will be replaced with actual values:

- Native language: x
- Language being learned: x
- Flashcard format: x
- Input text: x
- Input text Context: x

Please output your response strictly using the Flashcard format provided by the user.
"""

MODEL = "gpt-4o-mini"

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Set up logging
logging.basicConfig(level=logging.INFO)  # Ensure the logging level is set to INFO
logger = logging.getLogger(__name__)


class FlashcardSide(BaseModel):
    primary: str
    secondary: Optional[str] = None


class Flashcard(BaseModel):
    front: FlashcardSide
    back: FlashcardSide


class Flashcards(BaseModel):
    flashcards: list[Flashcard]


def call_chatgpt(user_input: str, system_prompt: Optional[str] = None) -> str:
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "flashcards_response",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "flashcards": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "front": {
                                        "type": "object",
                                        "properties": {
                                            "primary": {"type": "string"},
                                            "secondary": {"type": ["string", "null"]},
                                        },
                                        "required": [
                                            "primary",
                                            "secondary",
                                        ],
                                        "additionalProperties": False,
                                    },
                                    "back": {
                                        "type": "object",
                                        "properties": {
                                            "primary": {"type": "string"},
                                            "secondary": {"type": ["string", "null"]},
                                        },
                                        "required": [
                                            "primary",
                                            "secondary",
                                        ],
                                        "additionalProperties": False,
                                    },
                                },
                                "required": ["front", "back"],
                                "additionalProperties": False,
                            },
                        }
                    },
                    "required": ["flashcards"],
                    "additionalProperties": False,
                },
            },
        },
        max_tokens=16383,
    )

    flashcards_data = response.choices[0].message.content

    return flashcards_data


def format_user_input(
    native_language: str,
    learning_language: str,
    flashcard_format: str,
    input_text: str,
    context: Optional[str] = None,
) -> str:
    return f"""
    - Native language: {native_language}
    - Language being learned: {learning_language}
    - Flashcard format: {flashcard_format}
    - Input text: {input_text}
    - Input text Context: {context}
    """


def generate_flashcards(
    native_language: str,
    learning_language: str,
    flashcard_format: str,
    input_text: str,
    is_audio_input: bool = False,
) -> Dict[str, Any]:
    user_input = format_user_input(
        native_language, learning_language, flashcard_format, input_text
    )
    chatgpt_response = call_chatgpt(
        user_input,
        system_prompt=(
            AUDIO_INPUT_SYSTEM_PROMPT if is_audio_input else TEXT_INPUT_SYSTEM_PROMPT
        ),
    )

    try:
        return json.loads(chatgpt_response)
    except json.JSONDecodeError as e:
        return {"error": "Failed to generate valid flashcards"}
