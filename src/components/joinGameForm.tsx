"use client";
import { doc, getDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { firestore } from "@/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JoinGameForm() {
  const [gamePin, setGamePin] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const checkGamePinValidity = async (gamePin: string): Promise<boolean> => {
    try {
      const quizzesCollectionRef = collection(firestore, "quizzes");

      // Check if the document with the provided gamePin exists
      const existingDoc = await getDoc(doc(quizzesCollectionRef, gamePin));

      return existingDoc.exists();
    } catch (error) {
      // @ts-ignore
      console.error("Error checking game pin validity:", error.message);
      return false;
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (!gamePin.trim()) {
        setErrorMessage("Please enter a valid Game PIN.");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);

        return;
      }

      const isValidGamePin = await checkGamePinValidity(gamePin);

      if (!isValidGamePin) {
        setErrorMessage("Game PIN not found. Please check and try again.");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);

        return;
      }

      router.push(`/quiz/${gamePin}`);
    }
  };

  const handleButtonClick = async () => {
    if (!gamePin.trim()) {
      setErrorMessage("Please enter a valid Game PIN.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    const isValidGamePin = await checkGamePinValidity(gamePin);

    if (!isValidGamePin) {
      setErrorMessage("Game PIN not found. Please check and try again.");
      return;
    }

    router.push(`/quiz/${gamePin}`);
  };

  return (
    <div className='scale-[1.8]'>
      <h1 className='w-64 select-none text-center font-extrabold text-6xl'>
        Kashoot
      </h1>
      <div className='grid grid-rows-2 gap-4 p-2 justify-center w-64 h-32 bg-background rounded-md'>
        <input
          onChange={(e) => setGamePin(e.target.value)}
          value={gamePin}
          type='text'
          maxLength={8}
          placeholder='Game PIN'
          className='block text-center
                    border-2
                    border-white
                    border-solid
                    bg-background-alt
                    font-bold
                    rounded-md
                    hover:border-accent
                    focus:border-accent
                    transition duration-[100] ease-in-out'
          onKeyDown={handleKeyPress}
        />
        <button
          className='bg-background-alt
                    rounded-md
                    outline-none
                    shadow-[0_3px_0px_0px_rgba(255,255,255)]
                    font-extrabold
                    hover:bg-accent
                    hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                    hover:translate-y-[2px]
                    active:shadow-none
                    active:translate-y-[4px]
                    transition duration-[100] ease-in-out
                    text-center
                    justify-center
                    p-3'
          onClick={handleButtonClick}
        >
          Enter
        </button>
      </div>
      <div className='absolute -bottom-24 left-1/2 w-64 transform -translate-x-1/2'>
        {errorMessage && (
          <div className='bg-red-400 text-white text-sm p-2 rounded-md font-semibold text-center animate-bounce'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
