import io
import time
import genanki
import random


def create_anki_model(flashcard_format):
    front_template = "".join(
        [
            f'<span style="font-size: 50px;">{{{{{"Term (Learning Language)" if field == "term_learning_language" else "Term (Native)" if field == "term_native" else "Example Sentence"}}}}}</span>'
            + "<br>"
            for field in flashcard_format["front"]
        ]
    )
    back_template = "".join(
        [
            f'<span style="font-size: {"50px" if i == 0 else "35px"};">{{{{{"Term (Learning Language)" if field == "term_learning_language" else "Term (Native)" if field == "term_native" else "Example Sentence"}}}}}</span>'
            + "<br>"
            for i, field in enumerate(flashcard_format["back"])
        ]
    )

    return genanki.Model(
        random.randrange(1 << 30, 1 << 31),
        "LangCard Flashcard Model",
        fields=[
            {"name": "Term (Learning Language)"},
            {"name": "Term (Native)"},
            {"name": "Example Sentence"},
            {"name": "Term Audio"},
            {"name": "Sentence Audio"},
        ],
        templates=[
            {
                "name": "Card 1",
                "qfmt": f"""
                    <div style="text-align: center; font-size: 1.5em; font-weight: bold;">
                        {front_template}
                    </div>
                    {{{{#Term Audio}}}}
                        <div style="text-align: center;">
                            <button onclick="document.getElementById('term_audio').play()" style="font-size: 1.2em; padding: 10px 20px;">Play Term Audio</button>
                            <audio id="term_audio" autoplay src="data:audio/mpeg;base64,{{{{Term Audio}}}}"></audio>
                        </div>
                    {{{{/Term Audio}}}}
                """,
                "afmt": f"""
                    <div style="text-align: center;">
                        <div style="text-align: center; font-size: 1.5em; font-weight: bold;">
                            {front_template}
                    </div>

                        <hr/>

                        {back_template}
                    </div>
                    {{{{#Term Audio}}}}
                        <div style="text-align: center;">
                            <button onclick="document.getElementById('term_audio').play()" style="font-size: 1.2em; padding: 10px 20px;">Play Term Audio</button>
                            <audio id="term_audio" autoplay src="data:audio/mpeg;base64,{{{{Term Audio}}}}"></audio>
                        </div>
                    {{{{/Term Audio}}}}
                    {{{{#Sentence Audio}}}}
                        <div style="text-align: center;">
                            <br>
                            <button onclick="document.getElementById('sentence_audio').play()" style="font-size: 1.2em; padding: 10px 20px;">Play Sentence Audio</button>
                            <audio id="sentence_audio" src="data:audio/mpeg;base64,{{{{Sentence Audio}}}}"></audio>
                        </div>
                    {{{{/Sentence Audio}}}}
                """,
            },
        ],
    )


def create_anki_note(model, flashcard):
    return genanki.Note(
        model=model,
        fields=[
            flashcard["term_learning_language"],
            flashcard["term_native"],
            flashcard["example_sentence_learning_language"],
            flashcard.get("term_audio", ""),
            flashcard.get("sentence_audio", ""),
        ],
    )


def create_anki_export(flashcards_data, flashcard_format):
    model = create_anki_model(flashcard_format)
    deck = genanki.Deck(random.randrange(1 << 30, 1 << 31), "LangCard Flashcards")

    for fc in flashcards_data:
        if fc["active"]:
            note = create_anki_note(model, fc)
            deck.add_note(note)

    package = genanki.Package(deck)

    # Create a temporary file to store the .apkg
    temp_file = io.BytesIO()
    package.write_to_file(temp_file)
    temp_file.seek(0)

    return temp_file, f"langcard_flashcards_{int(time.time())}.apkg"
