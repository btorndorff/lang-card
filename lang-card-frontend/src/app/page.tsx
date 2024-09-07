"use client";

import { useState } from "react";
import Image from "next/image";
import FlashcardGenerator from "./components/FlashcardGenerator";
import Logo from "../../public/lang_card_logo.svg";

const Home = () => {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="relative h-screen overflow-x-hidden">
      <div className="flex flex-col items-center relative z-10">
        <header className="text-center h-[15%] bg-primary-red p-[30px] w-full">
          <Image
            src={Logo}
            alt="Lang Card"
            className="mx-auto mb-2 cursor-pointer"
            onClick={handleReset}
          />
          <h1 className="text-white font-bold text-xl">
            AI Generated language learning flashcards
          </h1>
        </header>
        <main className="p-[25px] container">
          <FlashcardGenerator key={resetKey} handleReset={handleReset} />
        </main>
      </div>
    </div>
  );
};

export default Home;
