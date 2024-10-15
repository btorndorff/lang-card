from typing import Optional
from openai import OpenAI
import os
from dotenv import load_dotenv
from pydub import AudioSegment
from pydub.silence import split_on_silence
from io import BytesIO
import base64


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def transcribe_audio(audio_file: str, learning_language: str) -> Optional[dict]:
    with open(audio_file, "rb") as file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=file,
            language=learning_language,
            response_format="verbose_json",
            timestamp_granularities=["word"],
        )
    return transcription


def clip_audio(audio_file: str, start_ms: int, end_ms: int, output_file: str) -> None:
    """Clip a segment of the audio from start_ms to end_ms and save it to output_file."""
    audio = AudioSegment.from_file(audio_file)
    clipped_audio = audio[start_ms:end_ms]
    clipped_audio.export(output_file, format="mp3")


def clip_audio_by_silence(
    audio_file: str, min_silence_len: int = 500, silence_thresh: int = -40
) -> list:
    audio = AudioSegment.from_file(audio_file)
    chunks = split_on_silence(
        audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh
    )

    base64_audio_clips = []
    for chunk in chunks:
        buffer = BytesIO()
        chunk.export(buffer, format="mp3")
        base64_audio = base64.b64encode(buffer.getvalue()).decode("utf-8")
        base64_audio_clips.append(base64_audio)

    return base64_audio_clips
