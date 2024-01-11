"use client";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import TextInputDisplay from "./questions-display/textInputDisplay";
import { firestore } from "@/firebase/config";
import TrueFalseDisplay from "./questions-display/trueFalseDisplay";
import MultipleChoiceDisplay from "./questions-display/multipleChoiceDisplay";

interface MultipleChoiceQuestion {
  qType: string;
  qData: {
    content: string;
    answer: number;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
}

interface TextInputQuestion {
  qType: string;
  qData: {
    content: string;
    answer: string;
  };
}

interface TrueFalseQuestion {
  qType: string;
  qData: {
    content: string;
    answer: boolean;
  };
}

interface QuizData {
  id: string;
  quizName: string;
  userName: string;
  questions: Array<
    MultipleChoiceQuestion | TextInputQuestion | TrueFalseQuestion
  >;
}

export interface QuizDisplayProps {
  quizID: string;
}

export default function QuizDisplay(props: QuizDisplayProps) {
  const [quizData, setQuizData] = useState<QuizData>({
    id: "",
    quizName: "",
    userName: "",
    questions: [],
  });

  const [userAnswers, setUserAnswers] = useState<
    Array<number | string | boolean>
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [isInputEnabled, setIsInputEnabled] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDocRef = doc(firestore, "quizzes", props.quizID);
        const quizDocSnapshot = await getDoc(quizDocRef);

        if (quizDocSnapshot.exists()) {
          const newQuizData: QuizData = {
            id: quizDocSnapshot.id,
            quizName: quizDocSnapshot.data().quizName,
            userName: quizDocSnapshot.data().userName,
            questions: quizDocSnapshot.data().questions || [],
          };

          setQuizData(newQuizData);
        } else {
          console.error("Quiz document does not exist.");
        }
      } catch (error) {
        //@ts-ignore
        console.error("Error fetching quiz:", error.message);
      }
    };

    fetchQuiz();
  }, [props.quizID]);

  const handleAnswer = (answer: number | string | boolean) => {
    if (!isInputEnabled) {
      return; // Do nothing if input is disabled
    }

    const currentQuestion = quizData.questions[currentQuestionIndex].qData;
    const correctAnswer = currentQuestion.answer;

    setUserAnswers((prevAnswers) => [...prevAnswers, answer]);

    let isCorrect = false;

    if (quizData.questions[currentQuestionIndex].qType === "textInput") {
      const userAnswersList = answer
        .toString()
        .toLowerCase()
        .split(",")
        .map((option) => option.trim());

      const correctAnswersList = correctAnswer
        .toString()
        .toLowerCase()
        .split(",")
        .map((option) => option.trim());

      isCorrect = userAnswersList.some((userAnswer) =>
        correctAnswersList.includes(userAnswer)
      );
    } else {
      isCorrect = answer === correctAnswer;
    }

    if (isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }

    setFeedback(isCorrect ? "Correct!" : "Wrong!");
    setIsInputEnabled(false); // Disable input

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setUserAnswers([]); // Clear user answers
      setIsInputEnabled(true); // Enable input for the next question
    }, 1500);
  };

  return (
    <div>
      <h1 className='text-5xl font-semibold w-11/12 text-center select-none pb-2'>
        {quizData.quizName}
      </h1>
      <div className='bg-background w-[40rem] h-[40rem] rounded-md'>
        {quizData.questions.length > 0 ? (
          currentQuestionIndex < quizData.questions.length ? (
            <>
              {feedback && (
                <div
                  className={
                    "flex items-center justify-center rounded-md border-white border-2 w-48 h-12 text-3xl font-semibold text-center text-text absolute bottom-16 left-16 animate-bounce " +
                    (feedback === "Correct!" ? "bg-green-500" : "bg-red-400")
                  }
                >
                  {feedback}
                  <div
                    className={
                      "absolute inset-0 rounded-md ring-4 " +
                      (feedback === "Correct!"
                        ? "ring-green-300"
                        : "ring-red-300") +
                      " filter blur-md"
                    }
                  ></div>
                </div>
              )}

              {quizData.questions[currentQuestionIndex].qType ===
              "trueOrFalse" ? (
                <TrueFalseDisplay
                  content={
                    (currentQuestionIndex + 1).toString() +
                    ". " +
                    quizData.questions[currentQuestionIndex].qData.content
                  }
                  onAnswerSubmit={handleAnswer}
                />
              ) : quizData.questions[currentQuestionIndex].qType ===
                "multipleChoice" ? (
                <MultipleChoiceDisplay
                  content={
                    (currentQuestionIndex + 1).toString() +
                    ". " +
                    quizData.questions[currentQuestionIndex].qData.content
                  }
                  option1={
                    // @ts-ignore
                    quizData.questions[currentQuestionIndex].qData.option1
                  }
                  option2={
                    // @ts-ignore
                    quizData.questions[currentQuestionIndex].qData.option2
                  }
                  option3={
                    // @ts-ignore
                    quizData.questions[currentQuestionIndex].qData.option3
                  }
                  option4={
                    // @ts-ignore
                    quizData.questions[currentQuestionIndex].qData.option4
                  }
                  onAnswerSubmit={handleAnswer}
                />
              ) : (
                <TextInputDisplay
                  content={
                    (currentQuestionIndex + 1).toString() +
                    ". " +
                    quizData.questions[currentQuestionIndex].qData.content
                  }
                  onAnswerSubmit={handleAnswer}
                />
              )}
            </>
          ) : (
            <div className='flex items-center justify-center flex-col w-[100%] h-[100%]'>
              <h1 className='text-text text-5xl font-bold'>Well Done!</h1>
              <p className='text-text text-xl'>
                You answered{" "}
                <strong>
                  {correctAnswersCount}/{quizData.questions.length}
                </strong>{" "}
                questions correctly.
              </p>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className='mt-4 px-6 py-2 bg-primary text-text transition-transform transform hover:scale-105 focus:outline-none
                rounded-md font-semibold text-xl border-solid hover:border-2 hover:brightness-[1.2] active:scale-[.97] duration-75 ease-linear'
              >
                Go to Homepage
              </button>
            </div>
          )
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
}
