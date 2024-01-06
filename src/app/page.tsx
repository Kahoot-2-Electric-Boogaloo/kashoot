import JoinGameForm from "@/components/joinGameForm";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
      }}
    >
      <JoinGameForm />
    </main>
  );
}
