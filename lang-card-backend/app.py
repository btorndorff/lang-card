import os
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from utils.transcription import transcribe_audio
from utils.gpt import generate_flashcards
from utils.tts import add_audio_to_flashcards
import io
import time
import json


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "/tmp"
ALLOWED_EXTENSIONS = {"wav", "mp3", "ogg", "m4a"}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/generate_flashcards", methods=["POST"])
def generate_flashcards_endpoint():
    native_language = request.form.get("nativeLanguage")
    learning_language = request.form.get("learningLanguage")
    flashcard_format = request.form.get("flashcardFormat")
    audio_toggle = request.form.get("audioToggle")

    if not all([native_language, learning_language, flashcard_format, audio_toggle]):
        return jsonify({"error": "Missing form data"}), 400

    audio_toggle = audio_toggle == "true"

    if "audioFile" in request.files:
        audio_file = request.files["audioFile"]
        if audio_file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(audio_file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        filename = secure_filename(audio_file.filename)
        audio_path = os.path.join(UPLOAD_FOLDER, filename)

        try:
            audio_file.save(audio_path)
            transcription = transcribe_audio(audio_path, learning_language)

            if not transcription:
                return jsonify({"error": "Transcription failed"}), 400

            flashcards = generate_flashcards(
                native_language,
                learning_language,
                flashcard_format,
                transcription,
            )
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return jsonify({"error": str(e)}), 500
        finally:
            if os.path.exists(audio_path):
                os.remove(audio_path)
    else:
        input_text = request.form.get("inputText")

        if not input_text:
            return jsonify({"error": "No input text provided"}), 400

        try:
            flashcards = generate_flashcards(
                native_language,
                learning_language,
                flashcard_format,
                input_text,
            )
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return jsonify({"error": str(e)}), 500

    if audio_toggle:
        flashcard_format_dict = json.loads(flashcard_format)
        flashcards = add_audio_to_flashcards(
            flashcards, learning_language, flashcard_format_dict
        )

    return jsonify(flashcards), 200


@app.route("/export_anki", methods=["POST"])
def export_anki():
    flashcards = request.json.get("flashcards")

    if flashcards:
        # active_flashcards = [fc for fc in flashcards if fc.get("active")]

        formatted_flashcards = []
        for fc in flashcards:
            front_primary = fc["front"].get("primary")
            front_secondary = fc["front"].get("secondary")
            front_audio = fc["front"].get("audio")
            front_content_parts = []
            if front_primary:
                front_content_parts.append(
                    f"<span style='font-size: 1.5em; font-weight: bold;'>{front_primary}</span>"
                )
            if front_secondary:
                front_content_parts.append(f"<br><br>{front_secondary}")
            if front_audio:
                front_content_parts.append(
                    f"<br><button onclick=\"document.getElementById('audio_{fc['front']['primary']}_front').play()\">Play Audio</button>"
                    f"<audio id='audio_{fc['front']['primary']}_front' autoplay><source src='data:audio/mp3;base64,{front_audio}' type='audio/mp3'></audio>"
                )
            if front_content_parts:
                front_content = f"<div style='text-align:center;'>{''.join(front_content_parts)}</div>"
            else:
                continue

            back_primary = fc["back"].get("primary")
            back_secondary = fc["back"].get("secondary")
            back_audio = fc["back"].get("audio")
            back_content_parts = []

            if back_primary:
                back_content_parts.append(
                    f"<span style='font-size: 1.5em; font-weight: bold;'>{back_primary}</span>"
                )
            if back_secondary:
                back_content_parts.append(f"<br><br>{back_secondary}")
            if back_audio:
                back_content_parts.append(
                    f"<br><button onclick=\"document.getElementById('audio_{fc['front']['primary']}').play()\">Play Audio</button>"
                    f"<audio id='audio_{fc['front']['primary']}'><source src='data:audio/mp3;base64,{back_audio}' type='audio/mp3'></audio>"
                )
            if back_content_parts:
                back_content = f"<div style='text-align:center;'>{''.join(back_content_parts)}</div>"
            else:
                continue

            formatted_flashcards.append(f"{front_content}|{back_content}")

        export_content = "\n".join(formatted_flashcards)

        memory_file = io.BytesIO()
        memory_file.write(export_content.encode("utf-8"))
        memory_file.seek(0)

        return send_file(
            memory_file,
            as_attachment=True,
            download_name=f"flashcards_{int(time.time())}.txt",
            mimetype="text/plain",
        )

    return jsonify({"error": "No flashcards provided"}), 400


if __name__ == "__main__":
    app.run(debug=True)
