# Lang Card

Try it here -> https://langcard.pages.dev

Lang Card is a language learning tool that generates custom flashcards from either audio or text input. Whether you're studying through a lesson with a tutor, listening to music in your target language, or working with other spoken content, Lang Card will help you create flashcards based on what you hear. If you prefer more control, you can also directly input text to specify the content of your flashcards.

### Features
- **Audio Input**: Upload an audio file (e.g., a recorded lesson, a conversation, or a song), and Lang Card will generate flashcards from the spoken content.
- **Text Input**: Enter instructions directly to generate flashcards tailored to your specific learning needs. 
- **Customizable Flashcards**: The flashcards are automatically generated based on the input you provide and can be customized to your needs such as which side the target language/native language is on, example sentences, and even audio.
- **Exportable Flashcards**: once your flashcards are generated you can export them to anki or quizlet using the export button

---

### Tech Stack

- **Frontend**: Next.js hosted on cloudflare pages
- **Backend**: Flask hosted on pythonanywhere
- **AI Models**: Whisper for audio transcription, GPT for flashcard generation, and Eleven labs TTS or Google TTS for audio for flashcards
