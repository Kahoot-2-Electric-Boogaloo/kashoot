import QuizCreator from "@/components/form-elements/quizCreator";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <QuizCreator />
    </main>
  );
}
