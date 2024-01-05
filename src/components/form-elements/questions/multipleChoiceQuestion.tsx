import React, { ChangeEvent, useEffect, useState } from "react";

export interface MultipleChoiceQuestionData {
  qType: string;
  qData: {
    content: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: number;
  };
}

interface MultipleChoiceQuestionProps {
  onDataChange: (data: MultipleChoiceQuestionData) => void;
}

export default function MultipleChoiceQuestion(
  props: MultipleChoiceQuestionProps
) {
  const [data, setData] = useState<MultipleChoiceQuestionData>({
    qType: "multipleChoice",
    qData: {
      content: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: 1,
    },
  });

  useEffect(() => {
    props.onDataChange(data);
  }, [data]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setData((prevData) => {
      if (name.startsWith("option")) {
        const optionNumber = parseInt(name.substring(6), 10);
        return {
          ...prevData,
          qData: {
            ...prevData.qData,
            [`option${optionNumber}`]: value,
          },
        };
      }

      return {
        ...prevData,
        qData: {
          ...prevData.qData,
          [name]: name === "answer" ? parseInt(value, 10) : value,
        },
      };
    });
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
      <label className='font-semibold text-xl'>Option 1:</label>
      <input
        type='text'
        placeholder='Type your question...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
        name='option1'
        value={data.qData.option1}
        onChange={handleInputChange}
      />
      <label className='font-semibold text-xl'>Option 2:</label>
      <input
        type='text'
        placeholder='Type your question...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
        name='option2'
        value={data.qData.option2}
        onChange={handleInputChange}
      />
      <label className='font-semibold text-xl'>Option 3:</label>
      <input
        type='text'
        placeholder='Type your question...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
        name='option3'
        value={data.qData.option3}
        onChange={handleInputChange}
      />
      <label className='font-semibold text-xl'>Option 4:</label>
      <input
        type='text'
        placeholder='Type your question...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
        name='option4'
        value={data.qData.option4}
        onChange={handleInputChange}
      />
      <label className='font-semibold text-xl'>Answer:</label>
      <select
        className='bg-background-alt pl-2 rounded-md border-2 border-accent hover:bg-background ease-linear duration-150 active:bg-background-alt'
        name='answer'
        value={data.qData.answer.toString()}
        onChange={handleInputChange}
      >
        <option value='1'>Option 1</option>
        <option value='2'>Option 2</option>
        <option value='3'>Option 3</option>
        <option value='4'>Option 4</option>
      </select>
    </div>
  );
}
