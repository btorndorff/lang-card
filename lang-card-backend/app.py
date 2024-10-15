import os
import logging
from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from utils.transcription import transcribe_audio
from utils.gpt import generate_flashcards
from models.flashcard import Flashcards
from utils.tts import add_audio_to_flashcards
from utils.export import create_anki_export


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

    if not all([native_language, learning_language]):
        return jsonify({"error": "Missing form data"}), 400

    if "audio_file" in request.files:
        audio_file = request.files["audio_file"]
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
                native_language, learning_language, transcription, is_audio_input=True
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
                native_language, learning_language, input_text
            )
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return jsonify({"error": str(e)}), 500

    return jsonify(flashcards.dict()), 200


@app.route("/add_audio_to_flashcards", methods=["POST"])
def add_audio_to_flashcards_endpoint():
    flashcards_data = request.json.get("flashcards")
    learning_language = request.json.get("learningLanguage")

    if not flashcards_data or not learning_language:
        return jsonify({"error": "Missing required data"}), 400

    try:
        flashcards = Flashcards(**{"flashcards": flashcards_data})
        flashcards_with_audio = add_audio_to_flashcards(flashcards, learning_language)
        return jsonify(flashcards_with_audio.dict()), 200
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/export_anki", methods=["POST"])
def export_anki():
    flashcards_data = request.json.get("flashcards", [])
    flashcard_format = request.json.get(
        "format",
        {
            "front": ["term_learning_language"],
            "back": ["term_native", "example_sentence_learning_language"],
        },
    )
    memory_file, filename = create_anki_export(flashcards_data, flashcard_format)

    response = make_response(
        send_file(memory_file, mimetype="application/octet-stream")
    )
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response


if __name__ == "__main__":
    app.run(debug=True)
