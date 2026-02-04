import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  Star,
  GraduationCap,
  Briefcase,
  ArrowLeft
} from "lucide-react";
import type { CareerRecommendation } from "./CareerResults";

export interface LearningResource {
  title: string;
  provider: string;
  type: "course" | "simulation" | "certification" | "bootcamp";
  duration: string;
  rating: number;
  skills: string[];
  url: string;
  description: string;
}

interface LearningResourcesProps {
  career: CareerRecommendation;
  resources: LearningResource[];
  onBack: () => void;
}

const providerLogos: Record<string, string> = {
  Coursera: "📚",
  Forage: "💼",
  Udemy: "🎓",
  LinkedIn: "💡",
  Google: "🔍",
  edX: "🎯",
};

const typeColors: Record<string, string> = {
  course: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  simulation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  certification: "bg-green-500/10 text-green-600 border-green-500/20",
  bootcamp: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const LearningResources = ({ career, resources, onBack }: LearningResourcesProps) => {
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>

          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{career.title}</h1>
                <p className="text-muted-foreground">Learning Path & Resources</p>
              </div>
            </div>
            <p className="text-muted-foreground">{career.rationale}</p>
          </div>
        </motion.div>

        {/* Resources grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Recommended Resources
          </h2>

          <div className="grid gap-4">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass rounded-xl p-5 hover:shadow-glass-lg transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Provider icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl">
                      {providerLogos[resource.provider] || "📖"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={typeColors[resource.type]}
                          >
                            {resource.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {resource.provider}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span>{resource.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.slice(0, 3).map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="secondary"
                            className="text-xs bg-secondary/50"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="gradient"
                      size="sm"
                      className="gap-2 whitespace-nowrap"
                      onClick={() => window.open(resource.url, "_blank")}
                    >
                      <BookOpen className="w-4 h-4" />
                      Start Learning
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6 border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Start with the job simulations on Forage to get hands-on experience, 
                then complement with structured courses to build theoretical knowledge. 
                This combination is highly valued by employers!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningResources;
