import React from "react";

export interface MultipleChoiceDisplayProps {
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  onAnswerSubmit: (selectedOptionIndex: number) => void;
}

const buttonClassName =
  "rounded-md font-semibold text-xl border-solid hover:border-2 hover:brightness-[1.2] active:scale-[.97] duration-75 ease-linear";

export default function MultipleChoiceDisplay(
  props: MultipleChoiceDisplayProps
) {
  const handleAnswerSubmit = (selectedOptionIndex: number) => {
    props.onAnswerSubmit(selectedOptionIndex);
  };

  return (
    <div className='flex flex-col h-[100%] w-[100%] justify-center items-center relative'>
      <h1 className='text-3xl font-semibold absolute left-4 top-8 w-11/12 indent-8 select-none'>
        {props.content}
      </h1>
      <div className='grid grid-cols-2 grid-rows-2 w-10/12 absolute bottom-20 gap-4'>
        <button
          className={`bg-accent ${buttonClassName}`}
          style={{ minHeight: "5rem" }}
          onClick={() => handleAnswerSubmit(1)}
        >
          {props.option1}
        </button>
        <button
          className={`bg-primary ${buttonClassName}`}
          style={{ minHeight: "5rem" }}
          onClick={() => handleAnswerSubmit(2)}
        >
          {props.option2}
        </button>
        <button
          className={`bg-secondary ${buttonClassName}`}
          style={{ minHeight: "5rem" }}
          onClick={() => handleAnswerSubmit(3)}
        >
          {props.option3}
        </button>
        <button
          className={`bg-blue-400 ${buttonClassName}`}
          style={{ minHeight: "5rem" }}
          onClick={() => handleAnswerSubmit(4)}
        >
          {props.option4}
        </button>
      </div>
    </div>
  );
}
