import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      emoji: "🧠",
      title: "AI-Powered Flashcards",
      description: "Auto-generate smart flashcards from your study materials"
    },
    {
      emoji: "📝",
      title: "Interactive Quizzes",
      description: "Test your knowledge with adaptive quizzes in CS topics"
    },
    {
      emoji: "📄",
      title: "PDF Summarizer",
      description: "Get instant AI summaries of complex technical documents"
    },
    {
      emoji: "📈",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Master Computer Science
              <br />
              <span className="text-4xl md:text-5xl">with AI-Powered Learning</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Transform your CS education with intelligent flashcards, adaptive quizzes, 
              and AI-powered study tools designed for modern learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6 hover:scale-105 transition-transform"
                onClick={() => navigate("/auth")}
              >
                🚀 Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all"
                onClick={() => navigate("/auth")}
              >
                🔑 Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Everything You Need to Excel in CS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-8 text-center bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of CS students who have accelerated their learning 
            with our AI-powered platform.
          </p>
          <Button 
            size="lg"
            className="text-lg px-12 py-6 bg-gradient-accent hover:scale-105 transition-transform"
            onClick={() => navigate("/auth")}
          >
            Start Learning Today 🎓
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-primary-foreground">
            <div>
              <h3 className="text-lg font-semibold mb-4">EduCS Platform</h3>
              <p className="text-primary-foreground/80">
                Empowering the next generation of computer scientists.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Flashcards</li>
                <li>Quizzes</li>
                <li>PDF Summarizer</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Subjects</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Data Structures</li>
                <li>Algorithms</li>
                <li>Operating Systems</li>
                <li>Database Systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            © 2024 EduCS Platform. Built with ❤️ for CS students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;