"use client";
import React, { useEffect, useState } from "react";
import QuestionSelector, { DataWithIndex } from "./questions/questionSelector";
import { TrueFalseQuestionData } from "./questions/trueFalseQuestion";
import { MultipleChoiceQuestionData } from "./questions/multipleChoiceQuestion";
import { TextInputQuestionData } from "./questions/textInputQuestion";

interface QuizCreatorProps {}

export default function QuizCreator(props: QuizCreatorProps) {
  const [questions, setQuestions] = useState<
    Array<
      | (TrueFalseQuestionData & { id: string })
      | (MultipleChoiceQuestionData & { id: string })
      | (TextInputQuestionData & { id: string })
    >
  >([]);

  useEffect(() => {
    console.log({ questions });
  }, [questions]);

  const handleDataFromChild = (newData: DataWithIndex) => {
    if ("index" in newData && "data" in newData) {
      const { index, data } = newData;
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index] = data as
          | (TrueFalseQuestionData & { id: string })
          | (MultipleChoiceQuestionData & { id: string })
          | (TextInputQuestionData & { id: string });
        return updatedQuestions;
      });
    }
  };

  const generateUniqueId = (): string => {
    return `question_${new Date().getTime()}`;
  };

  const addQuestion = () => {
    const newQuestion = {
      id: generateUniqueId(),
      qType: "",
      qData: {},
    } as TextInputQuestionData & { id: string };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const deleteQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-4/12 min-h-screen bg-background rounded-md p-2'>
      <h1 className='font-extrabold text-6xl'>Create Quiz</h1>
      {questions.map((question, index) => (
        <QuestionSelector
          key={index}
          index={index}
          onDataChange={(newData) =>
            handleDataFromChild({ index, data: newData })
          }
          onDelete={deleteQuestion}
        />
      ))}
      <button onClick={addQuestion}>Add Question</button>
    </div>
  );
}
