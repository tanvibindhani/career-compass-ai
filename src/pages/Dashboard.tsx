import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import DashboardMetrics from "@/components/DashboardMetrics";
import ImprovementRecommendations from "@/components/ImprovementRecommendations";
import ProgressTracker, { type ProgressItem } from "@/components/ProgressTracker";
import ProfileSection from "@/components/ProfileSection";
import { 
  Briefcase, 
  Trash2, 
  Sparkles
} from "lucide-react";

interface SavedRecommendation {
  id: string;
  career_title: string;
  description: string | null;
  match_score: number | null;
  rationale: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<SavedRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<SavedRecommendation | null>(null);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [allProgress, setAllProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchRecommendations();
      fetchAllProgress();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (selectedRecommendation) {
      fetchProgress(selectedRecommendation.id);
    }
  }, [selectedRecommendation]);

  const fetchRecommendations = async () => {
    const { data, error } = await supabase
      .from("saved_recommendations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load recommendations");
    } else {
      setRecommendations(data || []);
      if (data && data.length > 0) {
        setSelectedRecommendation(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchAllProgress = async () => {
    const { data, error } = await supabase
      .from("learning_progress")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setAllProgress(data);
    }
  };

  const fetchProgress = async (recommendationId: string) => {
    const { data, error } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("recommendation_id", recommendationId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load progress");
    } else {
      setProgressItems(data || []);
    }
  };

  const handleUpdateProgress = async (id: string, progress: number) => {
    const completed = progress === 100;
    const { error } = await supabase
      .from("learning_progress")
      .update({ 
        progress_percentage: progress, 
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update progress");
    } else {
      const updateItems = (items: ProgressItem[]) =>
        items.map(item =>
          item.id === id ? { ...item, progress_percentage: progress, completed } : item
        );
      setProgressItems(updateItems);
      setAllProgress(updateItems);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const progress = completed ? 100 : 0;
    const { error } = await supabase
      .from("learning_progress")
      .update({ 
        progress_percentage: progress, 
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update progress");
    } else {
      const updateItems = (items: ProgressItem[]) =>
        items.map(item =>
          item.id === id ? { ...item, progress_percentage: progress, completed } : item
        );
      setProgressItems(updateItems);
      setAllProgress(updateItems);
      toast.success(completed ? "Marked as complete!" : "Marked as incomplete");
    }
  };

  const handleDeleteRecommendation = async (id: string) => {
    const { error } = await supabase
      .from("saved_recommendations")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete recommendation");
    } else {
      toast.success("Recommendation deleted");
      setRecommendations(recs => recs.filter(r => r.id !== id));
      if (selectedRecommendation?.id === id) {
        const remaining = recommendations.filter(r => r.id !== id);
        setSelectedRecommendation(remaining.length > 0 ? remaining[0] : null);
      }
    }
  };

  // Calculate metrics
  const totalCareers = recommendations.length;
  const totalResources = allProgress.length;
  const completedResources = allProgress.filter(p => p.completed).length;
  const averageProgress = totalResources > 0 
    ? allProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / totalResources 
    : 0;
  
  // Calculate recent completions (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentCompletions = allProgress.filter(p => 
    p.completed && p.completed_at && new Date(p.completed_at) > oneWeekAgo
  ).length;

  // Calculate stalled resources (started but not touched in 7 days)
  const stalledResources = allProgress.filter(p => 
    !p.completed && 
    (p.progress_percentage || 0) > 0 && 
    new Date(p.updated_at) < oneWeekAgo
  ).length;

  const hasNoProgress = totalResources === 0;
  const hasIncompleteCourses = totalResources > 0 && completedResources < totalResources;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background orbs */}
      <div className="orb w-96 h-96 -top-48 -left-48 opacity-30" />
      <div className="orb w-80 h-80 -bottom-40 -right-40 animation-delay-2000 opacity-30" />

      <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <motion.h1 
            className="text-3xl font-bold mb-2"
            animate={{ 
              opacity: [1, 0.9, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Welcome <span className="gradient-text">back!</span>
          </motion.h1>
          <p className="text-muted-foreground">Track your career journey and learning progress</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ProfileSection />
        </motion.div>

        {/* Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DashboardMetrics
            totalCareers={totalCareers}
            totalResources={totalResources}
            completedResources={completedResources}
            averageProgress={averageProgress}
            recentCompletions={recentCompletions}
          />
        </motion.div>

        {/* Improvement Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <ImprovementRecommendations
            hasNoProgress={hasNoProgress}
            hasIncompleteCourses={hasIncompleteCourses}
            stalledResources={stalledResources}
            onNavigateHome={() => navigate("/")}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Saved recommendations sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Saved Careers
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  whileHover={{ scale: 1.02 }}
                  className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                    selectedRecommendation?.id === rec.id
                      ? "ring-2 ring-primary"
                      : "hover:shadow-glass"
                  }`}
                  onClick={() => setSelectedRecommendation(rec)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{rec.career_title}</h3>
                      {rec.match_score && (
                        <span className="text-sm text-primary">{rec.match_score}% match</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecommendation(rec.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              {recommendations.length === 0 && (
                <div className="text-center py-8 glass rounded-xl">
                  <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No saved careers yet</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => navigate("/")}
                  >
                    Get career recommendations
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Progress tracker */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            {selectedRecommendation ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-1">
                    {selectedRecommendation.career_title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecommendation.rationale || selectedRecommendation.description}
                  </p>
                </div>
                <ProgressTracker
                  items={progressItems}
                  onUpdateProgress={handleUpdateProgress}
                  onToggleComplete={handleToggleComplete}
                />
              </>
            ) : (
              <div className="text-center py-16 glass rounded-xl">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Select a career to track progress</h3>
                <p className="text-sm text-muted-foreground">
                  Your learning journey will appear here
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
