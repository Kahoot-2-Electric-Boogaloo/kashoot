"use client";
import React, { useEffect, useState } from "react";
import QuestionSelector, { DataWithIndex } from "./questions/questionSelector";
import { TrueFalseQuestionData } from "./questions/trueFalseQuestion";
import { MultipleChoiceQuestionData } from "./questions/multipleChoiceQuestion";
import { TextInputQuestionData } from "./questions/textInputQuestion";
import { useAuth } from "@/context/AuthContext";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/config";

interface QuizCreatorProps {}

export default function QuizCreator(props: QuizCreatorProps) {
  const [questions, setQuestions] = useState<
    Array<
      | (TrueFalseQuestionData & { id: string })
      | (MultipleChoiceQuestionData & { id: string })
      | (TextInputQuestionData & { id: string })
    >
  >([]);

  const { user } = useAuth();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    console.log({ questions });
  }, [questions]);

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
    // Generate an 8-digit unique ID
    const uniqueId = Math.floor(10000000 + Math.random() * 90000000).toString();
    return uniqueId;
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);

      // Check if the user is authenticated
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      // Use your user ID to create a reference to the user document
      const userDocRef = doc(firestore, "users", user.uid);

      // Get the existing user document data
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      // Check if the quizzes array exists, if not, initialize it
      const quizzesArray = userData?.quizzes || [];

      // Generate a unique ID for the new quiz
      let uniqueQuizId = generateUniqueQuizId();

      // Check if the generated ID already exists in the database
      while (
        quizzesArray.some((quiz: { id: string }) => quiz.id === uniqueQuizId)
      ) {
        uniqueQuizId = generateUniqueQuizId();
      }

      // Create or update the 'quizzes' field with the new quiz
      await updateDoc(userDocRef, {
        quizzes: [...quizzesArray, { id: uniqueQuizId, questions }],
      });

      console.log("Quiz submitted successfully!");
    } catch (error) {
      // @ts-ignore
      console.error("Error submitting quiz:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-4/12 bg-background rounded-md my-6 py-4'>
      <h1 className='font-extrabold text-7xl'>Create Quiz</h1>
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
