from openai import OpenAI
from dotenv import load_dotenv
import os
import base64
from elevenlabs.client import ElevenLabs
import io

ELEVENLABS_MODEL_ID = "eleven_turbo_v2_5"

load_dotenv()

open_ai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))


def generate_speech_chatgpt(input_text: str):
    response = open_ai_client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=input_text,
    )

    # convert to base64 to add to json
    audio_base64 = base64.b64encode(response.content).decode("utf-8")

    return audio_base64


def get_language_voice_id(language: str):
    if language == "vi":
        return "ueSxRO0nLF1bj93J2hVt"
    elif language == "ja":
        return "GxxMAMfQkDlnqjpzjLHH"
    else:
        raise ValueError(f"Unsupported language: {language}")


def generate_speech_elevenlabs(input_text: str, language: str):
    voice_id = get_language_voice_id(language)

    # Write the audio stream to a BytesIO object
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

    # Reset the buffer position to the beginning
    audio_buffer.seek(0)

    # Read the entire buffer and encode it to base64
    audio_base64 = base64.b64encode(audio_buffer.getvalue()).decode("utf-8")

    return audio_base64


def add_audio_to_flashcards(flashcards, learning_language, flashcard_format):
    for flashcard in flashcards["flashcards"]:
        # Generate audio for native language content
        if flashcard_format["front"]["primary"] == "learning_language":
            front_text = flashcard["front"]["primary"]
            if flashcard_format["front"]["secondary"] == "example_sentence":
                front_text += " " + flashcard["front"]["secondary"]
            front_audio = generate_speech_elevenlabs(front_text, learning_language)
            flashcard["front"]["audio"] = front_audio
        if flashcard_format["back"]["primary"] == "learning_language":
            back_text = flashcard["back"]["primary"]
            if flashcard_format["back"]["secondary"] == "example_sentence":
                back_text += " " + flashcard["back"]["secondary"]
            back_audio = generate_speech_elevenlabs(back_text, learning_language)
            flashcard["back"]["audio"] = back_audio

        # Generate audio for example sentence if not already combined
        if (
            flashcard_format["front"]["secondary"] == "example_sentence"
            and flashcard_format["front"]["primary"] != "learning_language"
        ):
            front_audio = generate_speech_elevenlabs(
                flashcard["front"]["secondary"], learning_language
            )
            flashcard["front"]["audio"] = front_audio
        if (
            flashcard_format["back"]["secondary"] == "example_sentence"
            and flashcard_format["back"]["primary"] != "learning_language"
        ):
            back_audio = generate_speech_elevenlabs(
                flashcard["back"]["secondary"], learning_language
            )
            flashcard["back"]["audio"] = back_audio

    return flashcards
