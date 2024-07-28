import { useQuiz } from "../contexts/QuizContext";
import Options from "./Options";

function Question() {
  const { questions, index } = useQuiz();
  const question = questions[index];

  if (!question) {
    return <div>Loading...</div>; // or some other fallback UI
  }

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}

export default Question;
