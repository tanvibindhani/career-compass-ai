import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Briefcase, 
  Heart, 
  Building2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X,
  Plus
} from "lucide-react";

interface FormData {
  educationLevel: string;
  skills: string[];
  interests: string[];
  industries: string[];
}

interface CareerFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const educationOptions = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Self-Taught / Bootcamp",
];

const suggestedSkills = [
  "Communication", "Leadership", "Problem Solving", "Data Analysis",
  "Project Management", "Programming", "Design", "Writing",
  "Marketing", "Sales", "Customer Service", "Research",
  "Financial Analysis", "Strategic Planning", "Team Management",
];

const suggestedInterests = [
  "Technology", "Healthcare", "Education", "Finance",
  "Creative Arts", "Science", "Entrepreneurship", "Social Impact",
  "Environment", "Travel", "Sports", "Music", "Writing",
];

const industryOptions = [
  "Technology", "Healthcare", "Finance", "Education",
  "Marketing", "Manufacturing", "Retail", "Consulting",
  "Entertainment", "Government", "Non-profit", "Startups",
];

const steps = [
  { icon: GraduationCap, title: "Education", description: "Your educational background" },
  { icon: Briefcase, title: "Skills", description: "What you're good at" },
  { icon: Heart, title: "Interests", description: "What excites you" },
  { icon: Building2, title: "Industries", description: "Where you want to work" },
];

const CareerForm = ({ onSubmit, isLoading }: CareerFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    educationLevel: "",
    skills: [],
    interests: [],
    industries: [],
  });
  const [customInput, setCustomInput] = useState("");

  const handleEducationSelect = (level: string) => {
    setFormData({ ...formData, educationLevel: level });
  };

  const handleAddItem = (field: "skills" | "interests" | "industries", item: string) => {
    if (!formData[field].includes(item)) {
      setFormData({ ...formData, [field]: [...formData[field], item] });
    }
  };

  const handleRemoveItem = (field: "skills" | "interests" | "industries", item: string) => {
    setFormData({ ...formData, [field]: formData[field].filter((i) => i !== item) });
  };

  const handleCustomAdd = (field: "skills" | "interests" | "industries") => {
    if (customInput.trim() && !formData[field].includes(customInput.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], customInput.trim()] });
      setCustomInput("");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.educationLevel !== "";
      case 1: return formData.skills.length >= 2;
      case 2: return formData.interests.length >= 2;
      case 3: return formData.industries.length >= 1;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setCustomInput("");
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCustomInput("");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {educationOptions.map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEducationSelect(level)}
                className={`p-4 rounded-xl text-left transition-all duration-300 ${
                  formData.educationLevel === level
                    ? "glass border-primary/50 shadow-glow"
                    : "glass hover:border-primary/30"
                }`}
              >
                <span className={`text-sm font-medium ${
                  formData.educationLevel === level ? "text-primary" : "text-foreground"
                }`}>
                  {level}
                </span>
              </motion.button>
            ))}
          </div>
        );

      case 1:
      case 2:
      case 3:
        const fieldMap = { 1: "skills", 2: "interests", 3: "industries" } as const;
        const suggestionsMap = { 
          1: suggestedSkills, 
          2: suggestedInterests, 
          3: industryOptions 
        };
        const field = fieldMap[currentStep as 1 | 2 | 3];
        const suggestions = suggestionsMap[currentStep as 1 | 2 | 3];

        return (
          <div className="space-y-6">
            {/* Selected items */}
            {formData[field].length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData[field].map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="pl-3 pr-1 py-1.5 gap-1 bg-primary/10 text-primary border-primary/20"
                  >
                    {item}
                    <button
                      onClick={() => handleRemoveItem(field, item)}
                      className="ml-1 p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Custom input */}
            <div className="flex gap-2">
              <Input
                placeholder={`Add custom ${field.slice(0, -1)}...`}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomAdd(field)}
                className="glass border-primary/20 focus:border-primary/50"
              />
              <Button
                variant="glass-primary"
                size="icon"
                onClick={() => handleCustomAdd(field)}
                disabled={!customInput.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions
                  .filter((item) => !formData[field].includes(item))
                  .slice(0, 12)
                  .map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddItem(field, item)}
                      className="px-3 py-1.5 rounded-full text-sm glass hover:border-primary/30 transition-all"
                    >
                      {item}
                    </motion.button>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                    backgroundColor: index <= currentStep 
                      ? "hsl(var(--primary))" 
                      : "hsl(var(--muted))",
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className={`w-5 h-5 ${
                    index <= currentStep ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-16 h-0.5 mx-2">
                    <motion.div
                      initial={false}
                      animate={{
                        width: index < currentStep ? "100%" : "0%",
                      }}
                      className="h-full bg-primary rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                    <div className="h-full bg-muted -mt-0.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <motion.div
          layout
          className="glass rounded-2xl p-8 shadow-glass-lg"
        >
          {/* Step header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[250px]"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              variant={currentStep === 3 ? "hero" : "default"}
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Analyzing...
                </>
              ) : currentStep === 3 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Recommendations
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CareerForm;
