from dotenv import load_dotenv
import os
import base64
from elevenlabs.client import ElevenLabs
import io
import concurrent.futures
from models.flashcard import Flashcards
import requests
import json

ELEVENLABS_MODEL_ID = "eleven_turbo_v2_5"

load_dotenv()

elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
google_tts_api_key = os.getenv("GOOGLE_TTS_API_KEY")


def _get_eleven_labs_language_voice_id(language: str):
    if language == "vi":
        return "ueSxRO0nLF1bj93J2hVt"
    elif language == "ja":
        return "GxxMAMfQkDlnqjpzjLHH"
    else:
        raise ValueError(f"Unsupported language: {language}")


def _generate_speech_elevenlabs(input_text: str, language: str):
    voice_id = _get_eleven_labs_language_voice_id(language)

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


def _get_google_tts_voice(language: str):
    if language == "vi":
        return {"languageCode": "vi-VN", "name": "vi-VN-Neural2-A"}
    elif language == "ja":
        return {"languageCode": "ja-JP", "name": "ja-JP-Wavenet-B"}
    else:
        raise ValueError(f"Unsupported language: {language}")


def _generate_speech_google(input_text: str, language: str):
    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={google_tts_api_key}"

    data = {
        "audioConfig": {"audioEncoding": "LINEAR16", "pitch": 0, "speakingRate": 1},
        "input": {"text": input_text},
        "voice": _get_google_tts_voice(language),
    }

    response = requests.post(
        url, headers={"Content-Type": "application/json"}, data=json.dumps(data)
    )

    if response.status_code == 200:
        audio_content = response.json()["audioContent"]
        return audio_content
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")


def _generate_speech(input_text: str, language: str, tts_type: str):
    if tts_type == "elevenlabs":
        return _generate_speech_elevenlabs(input_text, language)
    elif tts_type == "google":
        return _generate_speech_google(input_text, language)
    else:
        raise ValueError(f"Unsupported TTS type: {tts_type}")


def _process_flashcard(flashcard, learning_language, tts_type):
    term_audio = _generate_speech(
        flashcard["term_learning_language"], learning_language, tts_type
    )

    sentence_audio = _generate_speech(
        flashcard["example_sentence_learning_language"], learning_language, tts_type
    )

    flashcard["term_audio"] = term_audio
    flashcard["sentence_audio"] = sentence_audio

    return flashcard


def add_audio_to_flashcards(
    flashcards: Flashcards, learning_language: str, tts_type: str = "google"
) -> Flashcards:
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        flashcard_futures = [
            executor.submit(
                _process_flashcard, flashcard.dict(), learning_language, tts_type
            )
            for flashcard in flashcards.flashcards
        ]

        for future, index in zip(
            concurrent.futures.as_completed(flashcard_futures),
            range(len(flashcards.flashcards)),
        ):
            flashcards.flashcards[index] = future.result()

    return flashcards
