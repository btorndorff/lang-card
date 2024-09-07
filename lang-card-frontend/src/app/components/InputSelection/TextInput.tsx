const TextInput = ({
  text,
  setText,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="flex flex-col items-center justify-center gap-6 w-full max-w-[75%]">
    <textarea
      id="textInput"
      className="w-3/4 p-2 border-2 border-secondary-red rounded-md"
      rows={5}
      placeholder="ex: Please generate flashcards for the days of the week in vietnamese"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  </div>
);

export default TextInput;
