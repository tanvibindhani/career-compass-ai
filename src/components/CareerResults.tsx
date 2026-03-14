import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, ArrowLeft, BookOpen } from "lucide-react";
import { StaggerCareerCards } from "@/components/ui/stagger-career-cards";

export interface CareerRecommendation {
  title: string;
  matchScore: number;
  rationale: string;
  skills: string[];
  growthPotential: string;
  salaryRange: string;
  timeToTransition: string;
}

interface CareerResultsProps {
  recommendations: CareerRecommendation[];
  onSelectCareer: (career: CareerRecommendation) => void;
  onStartOver: () => void;
}

const CareerResults = ({ recommendations, onSelectCareer, onStartOver }: CareerResultsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveCareer = async (career: CareerRecommendation, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to save recommendations");
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("saved_recommendations").insert({
      user_id: user.id,
      career_title: career.title,
      description: career.rationale,
      match_score: career.matchScore,
      skills_match: career.skills,
      growth_potential: career.growthPotential,
      salary_range: career.salaryRange,
      rationale: career.rationale,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Career already saved");
      } else {
        toast.error("Failed to save career");
      }
    } else {
      toast.success(`${career.title} saved to your dashboard!`);
    }
  };

  return (
    <section className="min-h-screen py-20 px-4 overflow-hidden">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Your Personalized Results</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            animate={{ opacity: [1, 0.92, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Your <span className="gradient-text">Career Matches</span>
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your profile, here are the careers that align best with your skills,
            interests, and goals. Browse through to find your ideal path.
          </p>
        </motion.div>

        {/* Stagger career cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <StaggerCareerCards
            recommendations={recommendations}
            onSelectCareer={onSelectCareer}
            onSaveCareer={handleSaveCareer}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Button variant="ghost" onClick={onStartOver} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Start Over
          </Button>
          <Button variant="hero" size="lg" className="gap-2">
            <BookOpen className="w-4 h-4" />
            View Learning Resources
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerResults;
