"use client";
import { useEffect, useState } from "react";
import QuestionSelector from "./questions/questionSelector";
import { TrueFalseQuestionData } from "./questions/trueFalseQuestion";
import { MultipleChoiceQuestionData } from "./questions/multipleChoiceQuestion";
import { TextInputQuestionData } from "./questions/textInputQuestion";

export default function QuizCreator() {
  const [qType, setQType] = useState<string>("");
  const [qData, setQData] = useState({});

  useEffect(() => {
    console.log({ qType, qData });
  }, [qType, qData]);

  const handleDataFromChild = (
    newData:
      | TrueFalseQuestionData
      | MultipleChoiceQuestionData
      | TextInputQuestionData
      | {}
  ) => {
    if ("qType" in newData) {
      setQType(newData.qType);
    }

    if ("qData" in newData) {
      setQData(newData.qData);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-4/12 min-h-screen bg-background rounded-md p-2'>
      <h1 className='font-extrabold text-6xl'>Create Quiz</h1>
      <QuestionSelector onDataChange={handleDataFromChild} />
    </div>
  );
}
