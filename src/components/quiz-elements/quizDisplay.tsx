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

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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
                <p
                  className={
                    feedback === "Correct!" ? "text-green-500" : "text-red-500"
                  }
                >
                  {feedback}
                </p>
              )}
              {quizData.questions[currentQuestionIndex].qType ===
              "trueOrFalse" ? (
                <TrueFalseDisplay
                  content={
                    quizData.questions[currentQuestionIndex].qData.content
                  }
                  onAnswerSubmit={handleAnswer}
                />
              ) : quizData.questions[currentQuestionIndex].qType ===
                "multipleChoice" ? (
                <MultipleChoiceDisplay
                  content={
                    quizData.questions[currentQuestionIndex].qData.content
                  }
                  option1={
                    quizData.questions[currentQuestionIndex].qData.option1
                  }
                  option2={
                    quizData.questions[currentQuestionIndex].qData.option2
                  }
                  option3={
                    quizData.questions[currentQuestionIndex].qData.option3
                  }
                  option4={
                    quizData.questions[currentQuestionIndex].qData.option4
                  }
                  onAnswerSubmit={handleAnswer}
                />
              ) : (
                <TextInputDisplay
                  content={
                    quizData.questions[currentQuestionIndex].qData.content
                  }
                  onAnswerSubmit={handleAnswer}
                />
              )}
            </>
          ) : (
            <div>
              <p>Well Done</p>
              <p>
                You answered {correctAnswersCount} out of{" "}
                {quizData.questions.length} questions correctly.
              </p>
            </div>
          )
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
}
