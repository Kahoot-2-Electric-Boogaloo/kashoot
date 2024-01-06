"use client";
import React, { useEffect, useState } from "react";
import QuestionSelector, { DataWithIndex } from "./questions/questionSelector";
import { TrueFalseQuestionData } from "./questions/trueFalseQuestion";
import { MultipleChoiceQuestionData } from "./questions/multipleChoiceQuestion";
import { TextInputQuestionData } from "./questions/textInputQuestion";
import { useAuth } from "@/context/AuthContext";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/config";

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

  const { user } = useAuth();

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
    return Math.floor((Math.random() * 100) % 10).toString();
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);

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
    } catch (error) {
      //@ts-ignore
      console.error("Error submitting quiz:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-4/12 bg-background rounded-md my-6 py-4'>
      <h1 className='font-extrabold text-accent text-7xl'>Create Quiz</h1>
      <label className='font-semibold text-xl'>Quiz Name:</label>
      <input
        type='text'
        placeholder='Type your quiz name...'
        className='bg-background border-2 border-accent rounded-sm pl-1'
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
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={submitQuiz} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}
