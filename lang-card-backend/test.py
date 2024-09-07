import os
import json
import base64
from pydub import AudioSegment
from pydub.silence import split_on_silence
from dotenv import load_dotenv
from flask import Flask, jsonify, send_file
from io import BytesIO
from gpt import call_chatgpt
from transcription import clip_audio_by_silence
import time


def export_anki(flashcards, output_dir="."):
    formatted_flashcards = []
    for fc in flashcards:
        # Prepare front content
        front_primary = fc["front"].get("primary")
        front_secondary = fc["front"].get("secondary")
        front_content_parts = []

        if front_primary:
            front_content_parts.append(
                f"<span style='font-size: 1.5em; font-weight: bold;'>{front_primary}</span>"
            )

        if front_secondary:
            front_content_parts.append(f"<br><br>{front_secondary}")

        if front_content_parts:
            front_content = (
                f"<div style='text-align:center;'>{''.join(front_content_parts)}</div>"
            )
        else:
            continue  # Skip this flashcard if there is no front content

        # Prepare back content
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
                f"<audio id='audio_{fc['front']['primary']}' autoplay><source src='data:audio/mp3;base64,{back_audio}' type='audio/mp3'></audio>"
            )

        if back_content_parts:
            back_content = (
                f"<div style='text-align:center;'>{''.join(back_content_parts)}</div>"
            )
        else:
            continue  # Skip this flashcard if there is no back content

        # Add formatted flashcard to the list
        formatted_flashcards.append(f"{front_content}|{back_content}")

    # Join all formatted flashcards into a single string
    export_content = "\n".join(formatted_flashcards)

    # Create a file name with timestamp
    file_name = f"flashcards_{int(time.time())}.txt"
    file_path = f"{output_dir}/{file_name}"

    # Write the content to the file
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(export_content)

    return file_path


def format_user_input(
    native_language: str,
    learning_language: str,
    flashcard_format: str,
    inputted_text: str,
    added_context: str,
) -> str:
    return f"""
    - Native language: {native_language}
    - Language being learned: {learning_language}
    - Flashcard format: {flashcard_format}
    - Inputted text: {inputted_text}
    - User added context: {added_context}
    """


def main():
    system_prompt = """
You are a language learning flashcard generator. Your task is to create flashcards from an inputted text in the language the user is learning. The user may add context around what the text is. You may be prompted to include an example sentence using the new vocabulary word.

The user's input will be in the following format, where 'x' will be replaced with actual values:

- Native language: x
- Language being learned: x
- Flashcard format: x
- Inputted text: x
- User added context: x

Please output your response using the Flashcard format provided by the user.
"""
    user_input = format_user_input(
        "en",
        "vi",
        "primary front: vietnamese word, primary back: english definition of vietnamese word, secondary back: vietnamese example sentence",
        "của, Công việc, Gì, Mấy, bao nhiêu, Mẹ, Bố, Chị, Bạn gái, Bạn, Nhà, Em, Không, Một, Hai, Ba, Bốn, Năm, Sáu, Bảy, Tám, Chín, Mười, Mười lăm, Hai mươi lăm, Hai mươi mốt, Trăm, Nghìn, Triệu, Chủ nhật, Thứ hai, Thứ ba, Thứ tư, Thứ năm, Thứ sáu, Thứ bảy, Tháng một, Tháng hai, Tháng ba, Tháng tư, Tháng năm, Tháng sáu, Tháng bảy, Tháng tám, Tháng chín, Tháng mười, Tháng mười một, Tháng mười hai, Tháng, Tháng trước, Tháng này, Tháng sau/Tháng tới, Hôm kia, Hôm qua, Hôm nay, Ngày mai, Ngày kia, có, không phải, đúng rồi, người Mỹ, không, y tá, giáo viên, kỹ sư, con mèo, Đây, Kia, xe, chồng, Cuốn sách, cô giáo, Con chó, này, Cái bút, Cái bàn, Dạ, dọn, thích, nấu, ăn, chơi, Anh, với, tập thể dục, hằng ngày, công viên, muốn, cà phê, phở, đi, làm, Viết, Đọp, họp, tiếng Việt, xem phim, nghe, nhạc, vẽ",
        "this is a list of vietnamese vocab words",
    )
    # user_input = """
    #     Given the following vietnamese vowels: y, ê, e, ư, ơ, â, a, ă, u, ô, o

    #     Generate flashcards with only the front set as the corresponding vietnamese vowel.
    #     """
    flashcards = call_chatgpt(user_input, system_prompt)
    flashcards = json.loads(flashcards)

    # audio_file = "./vi.mp3"  # Path to your audio file with Vietnamese vowels
    # audio_clips = clip_audio_by_silence(audio_file)

    # for i, fc in enumerate(flashcards.get("flashcards", [])):
    #     if i < len(audio_clips):
    #         fc["back"]["audio"] = audio_clips[i + 1]

    # Generate Anki cards
    export_anki(flashcards["flashcards"])


if __name__ == "__main__":
    main()
