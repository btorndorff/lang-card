from openai import OpenAI
from dotenv import load_dotenv
import os
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_speech(input_text: str):
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=input_text,
    )

    # convert to base64 to add to json
    audio_base64 = base64.b64encode(response.content).decode("utf-8")

    return audio_base64
