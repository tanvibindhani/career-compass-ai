import { motion, useMotionValue, useTransform } from "framer-motion";
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
            whileHover={{ 
              y: -4, 
              transition: { duration: 0.2 } 
            }}
            className="glass rounded-xl p-4 cursor-default group"
          >
            <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
              <metric.icon className={`w-5 h-5 ${metric.color} transition-transform duration-300 group-hover:rotate-12`} />
            </div>
            <motion.p 
              className="text-2xl font-bold"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              {metric.value}
            </motion.p>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
        className="glass rounded-xl p-6 transition-shadow duration-300 hover:shadow-glass-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-5 h-5 text-primary" />
            </motion.div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-xs text-muted-foreground">Across all learning paths</p>
            </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Award className="w-4 h-4 text-primary" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold"
              key={averageProgress}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {Math.round(averageProgress)}%
            </motion.span>
          </div>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          style={{ originX: 0 }}
        >
          <Progress value={averageProgress} className="h-3" />
        </motion.div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{completedResources} of {totalResources} resources completed</span>
          <span>{totalResources - completedResources} remaining</span>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardMetrics;
