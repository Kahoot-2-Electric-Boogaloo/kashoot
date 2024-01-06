import { ChangeEvent, useEffect, useState } from "react";
import TrueFalseQuestion, { TrueFalseQuestionData } from "./trueFalseQuestion";
import MultipleChoiceQuestion, {
  MultipleChoiceQuestionData,
} from "./multipleChoiceQuestion";
import TextInputQuestion, { TextInputQuestionData } from "./textInputQuestion";

export interface DataWithIndex {
  index: number;
  id: string;
  data:
    | {}
    | TrueFalseQuestionData
    | MultipleChoiceQuestionData
    | TextInputQuestionData;
}

interface QuizSelectorProps {
  index: number;
  id: string;
  onDataChange: (
    data:
      | TrueFalseQuestionData
      | MultipleChoiceQuestionData
      | TextInputQuestionData
      | {}
  ) => void;
  onDelete: (index: string) => void;
}

export default function QuizSelector(props: QuizSelectorProps) {
  const [qType, setQType] = useState<string>();
  const [qData, setQData] = useState<
    | TrueFalseQuestionData
    | MultipleChoiceQuestionData
    | TextInputQuestionData
    | {}
  >({});

  useEffect(() => {
    props.onDataChange({ qType, qData });
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
    <div className='flex flex-col gap-2 bg-background-alt rounded-md p-2 w-10/12'>
      <label className='font-semibold text-xl'>Question Type:</label>
      <select
        name='qType'
        className='bg-background-alt pl-2 rounded-md border-2 border-accent hover:bg-background ease-linear duration-150 active:bg-background-alt'
        value={qType}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          setQType(event.target.value);
        }}
      >
        <option value='trueOrFalse'>True Or False</option>
        <option value='multipleChoice'>Multiple Choice</option>
        <option value='textInput'>Text Input</option>
      </select>
      {qType === "trueOrFalse" ? (
        <TrueFalseQuestion onDataChange={handleDataFromChild} />
      ) : qType === "multipleChoice" ? (
        <MultipleChoiceQuestion onDataChange={handleDataFromChild} />
      ) : (
        <TextInputQuestion onDataChange={handleDataFromChild} />
      )}
      <button onClick={() => props.onDelete(props.id)}>Delete Question</button>
    </div>
  );
}
