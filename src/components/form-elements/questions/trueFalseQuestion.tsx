import React, { ChangeEvent, useEffect, useState } from "react";

export interface TrueFalseQuestionData {
  qType: string;
  qData: {
    content: string;
    answer: boolean;
  };
}

interface TrueFalseQuestionProps {
  onDataChange: (data: TrueFalseQuestionData) => void;
}

export default function TrueFalseQuestion(props: TrueFalseQuestionProps) {
  const [qType, setQType] = useState<string>("trueOrFalse");
  const [qData, setQData] = useState({
    content: "",
    answer: true,
  });

  const textInputStyle =
    "bg-background border-2 border-accent rounded-sm pl-1 hover:bg-gray-800 duration-150 focus:bg-gray-800";

  useEffect(() => {
    props.onDataChange({ qType, qData });
  }, [qType, qData]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "answer") {
      setQData((prevData) => ({
        ...prevData,
        [name]: value === "true",
      }));
    } else {
      setQData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='font-semibold text-xl'>Question:</label>
      <input
        type='text'
        placeholder='Type your question...'
        className={textInputStyle}
        name='content'
        value={qData.content}
        onChange={handleInputChange}
      ></input>
      <label className='font-semibold text-xl'>Answer:</label>
      <select
        className='bg-background-alt pl-2 rounded-md border-2 border-accent hover:bg-background ease-linear duration-150 active:bg-background-alt'
        name='answer'
        value={qData.answer ? "true" : "false"}
        onChange={handleInputChange}
      >
        <option value='true'>True</option>
        <option value='false'>False</option>
      </select>
    </div>
  );
}
