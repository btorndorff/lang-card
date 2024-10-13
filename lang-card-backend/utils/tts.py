from dotenv import load_dotenv
import os
import base64
from elevenlabs.client import ElevenLabs
import io
import concurrent.futures
from models.flashcard import Flashcards

ELEVENLABS_MODEL_ID = "eleven_turbo_v2_5"

load_dotenv()

elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))


def _get_language_voice_id(language: str):
    if language == "vi":
        return "ueSxRO0nLF1bj93J2hVt"
    elif language == "ja":
        return "GxxMAMfQkDlnqjpzjLHH"
    else:
        raise ValueError(f"Unsupported language: {language}")


def _generate_speech_elevenlabs(input_text: str, language: str):
    voice_id = _get_language_voice_id(language)

    audio_buffer = io.BytesIO()
    for chunk in elevenlabs_client.text_to_speech.convert(
        voice_id=voice_id,
        optimize_streaming_latency="0",
        output_format="mp3_22050_32",
        text=input_text,
        model_id=ELEVENLABS_MODEL_ID,
        language_code=language,
        voice_settings={
            "stability": 1.0,
            "similarity_boost": 0.0,
            "style": 0.0,
            "use_speaker_boost": True,
        },
    ):
        if chunk:
            audio_buffer.write(chunk)

    audio_buffer.seek(0)

    audio_base64 = base64.b64encode(audio_buffer.getvalue()).decode("utf-8")

    return audio_base64


def _process_flashcard(flashcard, learning_language):
    term_audio = _generate_speech_elevenlabs(
        flashcard["term_learning_language"], learning_language
    )

    sentence_audio = _generate_speech_elevenlabs(
        flashcard["example_sentence_learning_language"], learning_language
    )

    flashcard["term_audio"] = term_audio
    flashcard["sentence_audio"] = sentence_audio

    return flashcard


def add_audio_to_flashcards(
    flashcards: Flashcards, learning_language: str
) -> Flashcards:
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        flashcard_futures = [
            executor.submit(_process_flashcard, flashcard.dict(), learning_language)
            for flashcard in flashcards.flashcards
        ]

        for future, index in zip(
            concurrent.futures.as_completed(flashcard_futures),
            range(len(flashcards.flashcards)),
        ):
            flashcards.flashcards[index] = future.result()

    return flashcards
