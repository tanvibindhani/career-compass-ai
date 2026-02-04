import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  ArrowRight, 
  BookOpen, 
  Target, 
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: typeof Lightbulb;
  priority: "high" | "medium" | "low";
}

interface ImprovementRecommendationsProps {
  hasNoProgress: boolean;
  hasIncompleteCourses: boolean;
  stalledResources: number;
  onNavigateHome: () => void;
}

const ImprovementRecommendations = ({
  hasNoProgress,
  hasIncompleteCourses,
  stalledResources,
  onNavigateHome
}: ImprovementRecommendationsProps) => {
  const recommendations: Recommendation[] = [];

  if (hasNoProgress) {
    recommendations.push({
      id: "start-learning",
      title: "Start Your Learning Journey",
      description: "You haven't started any courses yet. Begin with your top career match to build momentum.",
      action: "Get Career Recommendations",
      icon: Target,
      priority: "high"
    });
  }

  if (hasIncompleteCourses) {
    recommendations.push({
      id: "complete-courses",
      title: "Continue In-Progress Courses",
      description: "You have courses in progress. Completing them will boost your overall progress significantly.",
      action: "View Dashboard",
      icon: BookOpen,
      priority: "medium"
    });
  }

  if (stalledResources > 0) {
    recommendations.push({
      id: "stalled-resources",
      title: "Resume Stalled Learning",
      description: `${stalledResources} resource${stalledResources > 1 ? 's have' : ' has'} been inactive. Pick up where you left off!`,
      action: "Review Resources",
      icon: Clock,
      priority: "medium"
    });
  }

  // Always show some motivational recommendations
  recommendations.push({
    id: "explore-more",
    title: "Explore New Career Paths",
    description: "Discover additional career options that match your evolving skills and interests.",
    action: "Explore Careers",
    icon: Lightbulb,
    priority: "low"
  });

  if (recommendations.length < 3) {
    recommendations.push({
      id: "accelerate",
      title: "Accelerate Your Progress",
      description: "Consistent daily practice can speed up your learning by 40%. Set a daily learning goal.",
      action: "Set Goals",
      icon: Zap,
      priority: "low"
    });
  }

  const priorityColors = {
    high: "border-l-destructive bg-destructive/5",
    medium: "border-l-primary bg-primary/5",
    low: "border-l-muted-foreground bg-muted/5"
  };

  const priorityLabels = {
    high: "Recommended",
    medium: "Suggested",
    low: "Optional"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold">Personalized Recommendations</h3>
          <p className="text-xs text-muted-foreground">Based on your learning activity</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={`border-l-4 rounded-lg p-4 ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                <rec.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">
                    {priorityLabels[rec.priority]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1"
                  onClick={rec.id === "start-learning" || rec.id === "explore-more" ? onNavigateHome : undefined}
                >
                  {rec.action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ImprovementRecommendations;
