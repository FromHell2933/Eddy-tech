import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Quiz {
  id: number;
  topic: string;
  questions: Question[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const Quizzes = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const quizzes: Quiz[] = [
    {
      id: 1,
      topic: "Data Structures",
      questions: [
        {
          id: 1,
          question: "What is the time complexity of searching in a balanced Binary Search Tree?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          correct: 1
        },
        {
          id: 2,
          question: "Which data structure uses LIFO (Last In First Out) principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correct: 1
        },
        {
          id: 3,
          question: "What is the worst-case time complexity of bubble sort?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      topic: "Operating Systems",
      questions: [
        {
          id: 1,
          question: "What is a process in operating systems?",
          options: [
            "A program in execution",
            "A program stored on disk",
            "A CPU instruction",
            "A memory address"
          ],
          correct: 0
        },
        {
          id: 2,
          question: "Which scheduling algorithm gives the shortest average waiting time?",
          options: ["FCFS", "SJF", "Round Robin", "Priority"],
          correct: 1
        }
      ]
    }
  ];

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers, selectedAnswer];
      setUserAnswers(newAnswers);
      
      if (currentQuestion < selectedQuiz!.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === selectedQuiz.questions[index].correct) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResults(false);
  };

  if (showResults && selectedQuiz) {
    const score = calculateScore();
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 bg-gradient-card shadow-elevated text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👏" : "📚"}
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Quiz Complete!</h2>
            <p className="text-xl text-muted-foreground mb-6">
              You scored {score} out of {selectedQuiz.questions.length} questions
            </p>
            <div className="text-4xl font-bold text-primary mb-6">{percentage}%</div>
            <div className="flex gap-4 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                📝 Take Another Quiz
              </Button>
              <Button onClick={() => navigate("/dashboard")}>
                🏠 Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    const currentQ = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-hero text-primary-foreground py-8 px-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">📝 {selectedQuiz.topic} Quiz</h1>
                <p className="text-primary-foreground/80 mt-2">
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30"
                onClick={resetQuiz}
              >
                ← Back to Topics
              </Button>
            </div>
          </div>
        </header>

        {/* Progress */}
        <section className="py-6 px-6 bg-muted">
          <div className="container mx-auto">
            <Progress value={progress} className="h-3" />
          </div>
        </section>

        {/* Question */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-2xl">
            <Card className="p-8 bg-gradient-card shadow-elevated mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {currentQ.question}
              </h2>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={resetQuiz}
                className="px-6"
              >
                🏠 Back to Topics
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="px-6"
              >
                {currentQuestion === selectedQuiz.questions.length - 1 ? "🏁 Finish Quiz" : "Next Question →"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-8 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">📝 Interactive Quizzes</h1>
              <p className="text-primary-foreground/80 mt-2">
                Test your knowledge in various CS topics
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Quiz Topics */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Choose a Topic to Quiz Yourself
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quizzes.map((quiz) => (
              <Card 
                key={quiz.id}
                className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleStartQuiz(quiz)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {quiz.topic}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {quiz.questions.length} questions
                  </p>
                  <Button className="w-full">
                    Start Quiz →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quizzes;