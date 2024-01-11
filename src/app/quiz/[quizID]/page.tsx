import QuizDisplay from "@/components/quiz-elements/quizDisplay";

const QuizPage = ({ params }: { params: { quizID: string } }) => {
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
