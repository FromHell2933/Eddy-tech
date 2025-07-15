import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Flashcard {
  id: string;
  user_id: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
}

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [progress, setProgress] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setFlashcards(data as Flashcard[]);
        } else {
          // Insert sample flashcards if none exist
          const sampleCards = [
            {
              user_id: user.id,
              topic: "Data Structures",
              question: "What is a Binary Search Tree?",
              answer: "A Binary Search Tree (BST) is a binary tree data structure where the left subtree contains only nodes with values less than the parent node, and the right subtree contains only nodes with values greater than the parent node.",
              difficulty: "Medium"
            },
            {
              user_id: user.id,
              topic: "Algorithms",
              question: "What is the time complexity of Quick Sort in the average case?",
              answer: "O(n log n) - Quick Sort divides the array into partitions and recursively sorts them, leading to logarithmic depth with linear work at each level.",
              difficulty: "Medium"
            },
            {
              user_id: user.id,
              topic: "Operating Systems",
              question: "What is a deadlock?",
              answer: "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for the other to release a resource. The four conditions for deadlock are: mutual exclusion, hold and wait, no preemption, and circular wait.",
              difficulty: "Hard"
            },
            {
              user_id: user.id,
              topic: "Database Systems",
              question: "What is ACID in database systems?",
              answer: "ACID stands for Atomicity, Consistency, Isolation, and Durability - four properties that guarantee reliable processing of database transactions.",
              difficulty: "Easy"
            },
            {
              user_id: user.id,
              topic: "Networks",
              question: "What is the difference between TCP and UDP?",
              answer: "TCP is connection-oriented, reliable, and ensures data delivery in order. UDP is connectionless, faster, but does not guarantee delivery or order of packets.",
              difficulty: "Easy"
            }
          ];

          const { data: insertedData, error: insertError } = await supabase
            .from('flashcards')
            .insert(sampleCards)
            .select();

          if (insertError) throw insertError;
          if (insertedData) setFlashcards(insertedData as Flashcard[]);
        }
      } catch (error: any) {
        toast({
          title: "Error loading flashcards",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user, toast]);

  const topics = ["All", ...new Set(flashcards.map(card => card.topic))];
  
  const filteredCards = selectedTopic === "All" 
    ? flashcards 
    : flashcards.filter(card => card.topic === selectedTopic);

  const handleNext = () => {
    if (currentCard < filteredCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      setProgress(((currentCard + 1) / filteredCards.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
      setProgress(((currentCard - 1) / filteredCards.length) * 100);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-8">📚 Flashcards</h1>
          <p className="text-muted-foreground">No flashcards found for the selected topic.</p>
          <Button onClick={() => setSelectedTopic("All")} className="mt-4">
            Show All Cards
          </Button>
        </div>
      </div>
    );
  }

  const currentFlashcard = filteredCards[currentCard];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground py-8 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">📚 Flashcards</h1>
              <p className="text-primary-foreground/80 mt-2">
                Master CS concepts with interactive flashcards
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

      {/* Controls */}
      <section className="py-6 px-6 bg-muted">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground">Filter by topic:</label>
              <select 
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setCurrentCard(0);
                  setIsFlipped(false);
                  setProgress(0);
                }}
                className="px-3 py-2 border border-input bg-background rounded-md text-foreground"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              Card {currentCard + 1} of {filteredCards.length}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </section>

      {/* Flashcard */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card 
            className="relative h-80 bg-gradient-card shadow-elevated cursor-pointer transition-all duration-500 preserve-3d"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}
            onClick={handleFlip}
          >
            {/* Front of card - Question */}
            <div 
              className="absolute inset-0 p-8 flex flex-col justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentFlashcard.difficulty)}`}>
                  {currentFlashcard.difficulty}
                </span>
                <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {currentFlashcard.topic}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
                {currentFlashcard.question}
              </h2>
              <p className="text-center text-muted-foreground text-sm">
                💡 Click to reveal answer
              </p>
            </div>

            {/* Back of card - Answer */}
            <div 
              className="absolute inset-0 p-8 flex flex-col justify-center backface-hidden bg-primary text-primary-foreground"
              style={{ 
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Answer:</h3>
                <p className="text-primary-foreground/90 leading-relaxed">
                  {currentFlashcard.answer}
                </p>
                <p className="text-center text-primary-foreground/60 text-sm mt-6">
                  💡 Click to see question again
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              onClick={handlePrevious}
              disabled={currentCard === 0}
              variant="outline"
              className="px-6"
            >
              ← Previous
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleFlip}
                variant="secondary"
                className="px-6"
              >
                {isFlipped ? "🔄 Show Question" : "💡 Show Answer"}
              </Button>
            </div>

            <Button 
              onClick={handleNext}
              disabled={currentCard === filteredCards.length - 1}
              className="px-6"
            >
              Next →
            </Button>
          </div>

          {/* Study Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" className="hover:scale-105 transition-transform">
              😕 Hard
            </Button>
            <Button variant="secondary" className="hover:scale-105 transition-transform">
              😐 Okay
            </Button>
            <Button variant="accent" className="hover:scale-105 transition-transform">
              😊 Easy
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Flashcards;