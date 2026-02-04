import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Clock,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  BookOpen
} from "lucide-react";

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
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="gradient-text">Career Matches</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your profile, here are the careers that align best with your skills, 
            interests, and goals.
          </p>
        </motion.div>

        {/* Career cards */}
        <div className="space-y-6 mb-12">
          {recommendations.map((career, index) => (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="glass rounded-2xl p-6 md:p-8 hover:shadow-glass-lg transition-shadow group cursor-pointer"
              onClick={() => onSelectCareer(career)}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Match score */}
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 mx-auto md:mx-0">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-muted"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 226" }}
                        animate={{ 
                          strokeDasharray: `${(career.matchScore / 100) * 226} 226` 
                        }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold gradient-text">
                        {career.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        {career.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {career.rationale}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 hidden md:block" />
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {career.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Growth</p>
                        <p className="text-sm font-medium">{career.growthPotential}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Salary</p>
                        <p className="text-sm font-medium">{career.salaryRange}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Transition</p>
                        <p className="text-sm font-medium">{career.timeToTransition}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
