import io
import time


def format_flashcard(fc):
    front_content = f"<div style='text-align:center;'><span style='font-size: 1.5em; font-weight: bold;'>{fc['term_learning_language']}</span>"
    if "term_audio" in fc:
        front_content += f"<br><button onclick=\"document.getElementById('audio_{fc['term_learning_language']}_term').play()\">Play Term Audio</button>"
        front_content += f"<audio id='audio_{fc['term_learning_language']}_term'><source src='data:audio/mp3;base64,{fc['term_audio']}' type='audio/mp3'></audio>"
    front_content += "</div>"

    back_content = f"<div style='text-align:center;'><span style='font-size: 1.5em; font-weight: bold;'>{fc['term_native']}</span>"
    back_content += f"<br><br>{fc['example_sentence_learning_language']}"
    if "sentence_audio" in fc:
        back_content += f"<br><button onclick=\"document.getElementById('audio_{fc['term_learning_language']}_sentence').play()\">Play Sentence Audio</button>"
        back_content += f"<audio id='audio_{fc['term_learning_language']}_sentence'><source src='data:audio/mp3;base64,{fc['sentence_audio']}' type='audio/mp3'></audio>"
    back_content += "</div>"

    return f"{front_content}|{back_content}"


def create_anki_export(flashcards_data):
    formatted_flashcards = [format_flashcard(fc) for fc in flashcards_data]
    export_content = "\n".join(formatted_flashcards)

    memory_file = io.BytesIO()
    memory_file.write(export_content.encode("utf-8"))
    memory_file.seek(0)

    return memory_file, f"flashcards_{int(time.time())}.txt"
