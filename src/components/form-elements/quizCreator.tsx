"use client";
import React, { useEffect, useState } from "react";
import QuestionSelector, { DataWithIndex } from "./questions/questionSelector";
import { TrueFalseQuestionData } from "./questions/trueFalseQuestion";
import { MultipleChoiceQuestionData } from "./questions/multipleChoiceQuestion";
import { TextInputQuestionData } from "./questions/textInputQuestion";
import { useAuth } from "@/context/AuthContext";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { FaLocationArrow } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

export default function QuizCreator() {
  const [questions, setQuestions] = useState<
    Array<
      | (TrueFalseQuestionData & { id: string })
      | (MultipleChoiceQuestionData & { id: string })
      | (TextInputQuestionData & { id: string })
    >
  >([]);

  const [quizName, setQuizName] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quizCode, setQuizCode] = useState<string | null>(null);

  const { user } = useAuth();

  const textInputStyle =
    "bg-background border-2 border-accent rounded-sm pl-1 hover:bg-gray-800 duration-150 focus:bg-gray-800";

  useEffect(() => {
    console.log({ questions, quizName });
  }, [questions, quizName]);

  const handleDataFromChild = (newData: DataWithIndex) => {
    if ("index" in newData && "id" in newData && "data" in newData) {
      const { index, id, data } = newData;
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index] = { ...data, id } as TextInputQuestionData & {
          id: string;
        };
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

  const deleteQuestion = (id: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
  };

  const generateUniqueQuizId = (): string => {
    const random8DigitNumber = Math.floor(10000000 + Math.random() * 90000000);
    return random8DigitNumber.toString();
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);

      if (!quizName || questions.length === 0) {
        setError("Quiz name and at least one question are required.");

        // Hide the error div after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else if (
        questions.some(
          (q) =>
            !q.qType ||
            !q.qData ||
            !Object.values(q.qData).every((value) => value)
        )
      ) {
        setError("All questions should be filled in before submitting.");

        // Hide the error div after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        // Check if the user is authenticated
        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        // Reference to the "quizzes" collection
        const quizzesCollectionRef = collection(firestore, "quizzes");

        // Generate a unique ID for the new quiz
        let uniqueQuizId = generateUniqueQuizId();

        // Check if the generated ID already exists in the "quizzes" collection
        let existingDoc = await getDoc(doc(quizzesCollectionRef, uniqueQuizId));
        while (existingDoc.exists()) {
          uniqueQuizId = generateUniqueQuizId();
          existingDoc = await getDoc(doc(quizzesCollectionRef, uniqueQuizId));
        }

        // Create a new document within the "quizzes" collection
        await setDoc(doc(quizzesCollectionRef, uniqueQuizId), {
          userId: user.uid,
          userName: user.displayName,
          quizName,
          questions,
        });

        console.log("Quiz submitted successfully!");
        setQuizCode(uniqueQuizId);
      }
    } catch (error) {
      //@ts-ignore
      console.error("Error submitting quiz:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-4/12 bg-background rounded-md my-6 py-4'>
      {error && (
        <div className='bg-red-400 text-white p-2 rounded-md absolute top-5 font-bold'>
          {error}
        </div>
      )}
      {quizCode && (
        <div className='bg-green-500 text-white p-2 rounded-md'>
          Quiz Code: {quizCode}
        </div>
      )}
      <h1 className='font-extrabold text-accent text-7xl select-none'>
        Create Quiz
      </h1>
      <label className='font-semibold text-xl'>Quiz Name:</label>
      <input
        type='text'
        placeholder='Type your quiz name...'
        className={textInputStyle}
        name='quizName'
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      {questions.map((question, index) => (
        <QuestionSelector
          key={question.id}
          index={index}
          id={question.id}
          onDataChange={(newData) =>
            handleDataFromChild({ index, id: question.id, data: newData })
          }
          onDelete={() => deleteQuestion(question.id)}
        />
      ))}
      <div className='flex items-center justify-center gap-8'>
        <button
          className='flex items-center justify-center gap-1 text-lg w-16 bg-green-500 rounded-md border-white border-[1px] hover:bg-green-300 hover:text-slate-400 active:scale-95 duration-150'
          onClick={addQuestion}
        >
          <IoMdAddCircle />
          Add
        </button>
        <button
          className='flex items-center justify-center gap-1 text-lg w-24 bg-secondary rounded-md border-white border-[1px] hover:bg-orange-200 hover:text-slate-400 active:scale-95 duration-150'
          onClick={submitQuiz}
          disabled={isSubmitting}
        >
          <FaLocationArrow />
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
