import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  Award
} from "lucide-react";

interface MetricsProps {
  totalCareers: number;
  totalResources: number;
  completedResources: number;
  averageProgress: number;
  recentCompletions: number;
}

const DashboardMetrics = ({ 
  totalCareers, 
  totalResources, 
  completedResources, 
  averageProgress,
  recentCompletions 
}: MetricsProps) => {
  const metrics = [
    {
      label: "Saved Careers",
      value: totalCareers,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Learning Resources",
      value: totalResources,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      label: "Completed",
      value: completedResources,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      label: "This Week",
      value: recentCompletions,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center mb-3`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-xs text-muted-foreground">Across all learning paths</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xl font-bold">{Math.round(averageProgress)}%</span>
          </div>
        </div>
        <Progress value={averageProgress} className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{completedResources} of {totalResources} resources completed</span>
          <span>{totalResources - completedResources} remaining</span>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardMetrics;
