import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from typing import Optional
from models.flashcard import Flashcards

load_dotenv()

AUDIO_INPUT_SYSTEM_PROMPT = """
You are a language learning flashcard generator. Your task is to create flashcards from an inputted transcribed text in the language the user is learning. Extract as many unique vocabulary words from the text as possible. Exclude people's names. You may be prompted to include an example sentence using the new vocabulary word.

The user's input will be in the following format, where 'x' will be replaced with actual values:

- Native language: x
- Language being learned: x
- Flashcard format: x
- Transcribed text: x

Please output your response as a json.

Your response should be a list of flashcards. Flashcards should have the following fields:
- nativeLanguage: the term in the native language of the user
- learningLanguage: the term in the language the user is learning
- exampleSentence: an example sentence using the term in the language the user is learning
- termAudio: the audio for the term (it should be empty)
- sentenceAudio: the audio for the example sentence (it should be empty)
- active: whether the flashcard is active or not (it should be true)
"""

TEXT_INPUT_SYSTEM_PROMPT = """
You are a language learning flashcard generator. Your task is to create flashcards from an inputted text from the user in the language the user is learning.
You may be prompted to include an example sentence using the new vocabulary word. When generating example sentences ensure they are in the learning language and are simple and emphasize the new vocabulary word.

The user's input will be in the following format, where 'x' will be replaced with actual values:

- Native language: x
- Language being learned: x
- Input text: x
- Input text Context: x

Please output your response as json. Make sure you include all the flashcards in the response and fufill the users request completely.

Your response should be a list of flashcards. Flashcards should have the following fields:
- nativeLanguage: the term in the native language of the user
- learningLanguage: the term in the language the user is learning
- exampleSentence: an example sentence using the term in the language the user is learning
- termAudio: the audio for the term (it should be empty)
- sentenceAudio: the audio for the example sentence (it should be empty)
- active: whether the flashcard is active or not (it should be true)
"""

MODEL = "gpt-4o-mini"

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def call_chatgpt(user_input: str, system_prompt: Optional[str] = None) -> Flashcards:
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_input})

    response = client.beta.chat.completions.parse(
        model=MODEL,
        messages=messages,
        response_format=Flashcards,
        max_tokens=16383,
    )

    return response.choices[0].message.parsed


def format_user_input(
    native_language: str,
    learning_language: str,
    input_text: str,
    context: Optional[str] = None,
) -> str:
    return f"""
    - Native language: {native_language}
    - Language being learned: {learning_language}
    - Input text: {input_text}
    - Input text Context: {context}
    """


def generate_flashcards(
    native_language: str,
    learning_language: str,
    input_text: str,
    is_audio_input: bool = False,
) -> Flashcards:
    user_input = format_user_input(native_language, learning_language, input_text)
    return call_chatgpt(
        user_input,
        system_prompt=(
            AUDIO_INPUT_SYSTEM_PROMPT if is_audio_input else TEXT_INPUT_SYSTEM_PROMPT
        ),
    )
