import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  TrendingUp,
  BookOpen,
  ExternalLink
} from "lucide-react";

export interface ProgressItem {
  id: string;
  resource_title: string;
  resource_type: string;
  resource_url: string | null;
  resource_description: string | null;
  progress_percentage: number;
  completed: boolean;
}

interface ProgressTrackerProps {
  items: ProgressItem[];
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const typeColors: Record<string, string> = {
  course: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  simulation: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  certification: "bg-green-500/10 text-green-600 border-green-500/20",
  bootcamp: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const ProgressTracker = ({ items, onUpdateProgress, onToggleComplete }: ProgressTrackerProps) => {
  const completedCount = items.filter((item) => item.completed).length;
  const overallProgress = items.length > 0 
    ? Math.round(items.reduce((acc, item) => acc + item.progress_percentage, 0) / items.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall progress card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Learning Progress</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {items.length} completed
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold gradient-text">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </motion.div>

      {/* Individual items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass rounded-xl p-4 transition-all ${
              item.completed ? "opacity-75" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Completion toggle */}
              <button
                onClick={() => onToggleComplete(item.id, !item.completed)}
                className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge 
                    variant="outline" 
                    className={typeColors[item.resource_type] || "bg-muted"}
                  >
                    {item.resource_type}
                  </Badge>
                </div>
                <h4 className={`font-medium mb-2 ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                  {item.resource_title}
                </h4>
                
                {!item.completed && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Progress value={item.progress_percentage} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-10">
                        {item.progress_percentage}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((value) => (
                        <button
                          key={value}
                          onClick={() => onUpdateProgress(item.id, value)}
                          className={`text-xs px-2 py-1 rounded-md transition-all ${
                            item.progress_percentage >= value
                              ? "bg-primary/20 text-primary"
                              : "bg-muted hover:bg-muted/80 text-muted-foreground"
                          }`}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* External link */}
              {item.resource_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(item.resource_url!, "_blank")}
                  className="flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 glass rounded-xl">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No learning resources yet</h3>
          <p className="text-sm text-muted-foreground">
            Select a career and save learning resources to track your progress
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
