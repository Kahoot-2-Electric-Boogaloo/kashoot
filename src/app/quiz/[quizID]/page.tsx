"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, DocumentData } from "firebase/firestore";
import { firestore } from "@/firebase/config"; // Adjust the path as needed
import { useRouter } from "next/navigation";
import QuizDisplay from "@/components/quiz-elements/quizDisplay";

const QuizPage = ({ params }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
      }}
    >
      <QuizDisplay quizID={params.quizID} />
    </div>
  );
};

export default QuizPage;
