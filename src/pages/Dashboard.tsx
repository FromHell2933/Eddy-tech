import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const userId = user.id;

      const { count: flashcardCount } = await supabase
        .from("flashcards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { data: quizResults, error: quizError } = await supabase
        .from("quiz_results")
        .select("score, completed_at")
        .eq("user_id", userId);

      const quizCompleted = quizResults?.length || 0;
      const avgScore = quizResults?.length > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length
          )
        : 0;

      const lastDate = quizResults?.[0]?.completed_at || null;
      const streak = lastDate ? "1 day" : "0 days";

      setStats([
        { label: "Flashcards Reviewed", value: flashcardCount || 0, emoji: "📚" },
        { label: "Quizzes Completed", value: quizCompleted, emoji: "✅" },
        { label: "Study Streak", value: streak, emoji: "🔥" },
        { label: "Average Score", value: `${avgScore}%`, emoji: "🎯" },
      ]);
    };

    fetchStats();
  }, [user]);

  const features = [
    {
      emoji: "📚",
      title: "Flashcards",
      description: "Review and master CS concepts with smart flashcards",
      path: "/flashcards",
    },
    {
      emoji: "📝",
      title: "Quizzes",
      description: "Test your knowledge with interactive CS quizzes",
      path: "/quizzes",
    },
    {
      emoji: "📄",
      title: "PDF Summarizer",
      description: "Get AI summaries of technical documents and papers",
      path: "/summarizer",
    },
    {
      emoji: "📈",
      title: "Progress",
      description: "Track your learning progress and achievements",
      path: "/progress",
    },
    {
      emoji: "🧠",
      title: "MCQs",
      description: "Practice with multiple choice questions",
      path: "/mcqs",
    },
    {
      emoji: "💡",
      title: "Study Guide",
      description: "Access curated study materials and resources",
      path: "/study-guide",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground py-8 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.user_metadata?.full_name || "Student"}! 👋
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Ready to continue your CS journey?
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-primary-foreground/30"
              onClick={signOut}
            >
              🚪 Sign Out
            </Button>
          </div>
        </div>
      </header>

      <section className="py-8 px-6 bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center bg-card shadow-card hover:shadow-elevated transition-all"
              >
                <div className="text-2xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">Learning Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Open →
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-muted">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-accent hover:scale-105 transition-transform">
              📝 Take Random Quiz
            </Button>
            <Button variant="outline" className="hover:scale-105 transition-transform">
              📚 Review Flashcards
            </Button>
            <Button variant="secondary" className="hover:scale-105 transition-transform">
              📊 View Progress
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
