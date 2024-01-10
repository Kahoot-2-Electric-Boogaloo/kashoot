"use client";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function JoinGameForm() {
  const [gamePin, setGamePin] = useState<string>("");

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
                    transition duration-[100] ease-in-out
                    '
        />
        <Link
          href={`/quiz/${gamePin}`}
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
                    p-3
                '
        >
          Enter
        </Link>
      </div>
    </div>
  );
}
