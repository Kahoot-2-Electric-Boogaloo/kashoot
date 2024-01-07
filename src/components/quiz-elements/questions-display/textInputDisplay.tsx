import React, { useState } from "react";
export interface TextInputDisplayProps {
  content: string;
  onAnswerSubmit: (answer: string) => void;
}

const buttonClassName =
  "rounded-md font-semibold text-xl border-solid hover:border-2 hover:brightness-[1.2] active:scale-[.97] duration-75 ease-linear w-8/12 ml-auto mr-auto";

export default function TextInputDisplay(props: TextInputDisplayProps) {
  const [userInput, setUserInput] = useState("");

  const handleAnswerSubmit = () => {
    props.onAnswerSubmit(userInput);
  };

  return (
    <div className='flex flex-col h-[100%] w-[100%] justify-center items-center relative'>
      <h1 className='text-3xl font-semibold absolute left-4 top-8 w-11/12 indent-8 select-none'>
        {props.content}
      </h1>
      <div className='grid grid-cols-1 grid-rows-2 w-10/12 absolute bottom-20 gap-4'>
        <input
          className={
            "bg-background-alt rounded-xl text-center text-2xl font-semibold hover:border-4 border-accent"
          }
          style={{ minHeight: "5rem" }}
          type='text'
          placeholder='Type your answer...'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          className={"bg-secondary " + buttonClassName}
          onClick={handleAnswerSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
