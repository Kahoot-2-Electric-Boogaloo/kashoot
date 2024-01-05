import React, { ChangeEvent, useEffect, useState } from "react";

export interface TextInputQuestionData {
  qType: string;
  qData: {
    content: string;
    answer: string;
  };
}

interface TextInputQuestionProps {
  onDataChange: (data: TextInputQuestionData) => void;
}

export default function TextInputQuestion(props: TextInputQuestionProps) {
  const [data, setData] = useState<TextInputQuestionData>({
    qType: "textInput",
    qData: {
      content: "",
      answer: "",
    },
  });

  useEffect(() => {
    props.onDataChange(data);
  }, [data]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      qData: {
        ...prevData.qData,
        [name]: value,
      },
    }));
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='font-semibold text-xl'>Question:</label>
      <input
        type='text'
        placeholder='Type your question...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
        name='content'
        value={data.qData.content}
        onChange={handleInputChange}
      />
      <label className='font-semibold text-xl'>Answer:</label>
      <input
        type='text'
        placeholder='Provide a comma-separated list...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
        name='answer'
        value={data.qData.answer}
        onChange={handleInputChange}
      />
    </div>
  );
}
