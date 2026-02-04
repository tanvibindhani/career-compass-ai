import { useState } from "react";
import { toast } from "sonner";
import Hero from "@/components/Hero";
import CareerForm from "@/components/CareerForm";
import CareerResults, { type CareerRecommendation } from "@/components/CareerResults";
import LearningResources, { type LearningResource } from "@/components/LearningResources";
import Chatbot from "@/components/Chatbot";

type AppState = "hero" | "form" | "results" | "resources";

interface FormData {
  educationLevel: string;
  skills: string[];
  interests: string[];
  industries: string[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`;

const Index = () => {
  const [appState, setAppState] = useState<AppState>("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleGetStarted = () => {
    setAppState("form");
  };

  const parseStreamedJSON = async (response: Response): Promise<string> => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    if (!reader) throw new Error("No response body");

    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) fullContent += content;
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    return fullContent;
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFormData(data);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Analyze my profile and recommend suitable career paths:
              
Education Level: ${data.educationLevel}
Skills: ${data.skills.join(", ")}
Interests: ${data.interests.join(", ")}
Preferred Industries: ${data.industries.join(", ")}

Please provide 3-5 career recommendations with detailed analysis.`,
            },
          ],
          type: "analyze",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const content = await parseStreamedJSON(response);
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      setRecommendations(parsed.careers);
      setAppState("results");
      toast.success("Career analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = async (career: CareerRecommendation) => {
    setSelectedCareer(career);
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `I'm interested in becoming a ${career.title}. 
              
My current skills: ${formData?.skills.join(", ")}
My interests: ${formData?.interests.join(", ")}
My education: ${formData?.educationLevel}

Please recommend learning resources to help me transition into this career.`,
            },
          ],
          type: "resources",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get resources");
      }

      const content = await parseStreamedJSON(response);
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      setLearningResources(parsed.resources);
      setAppState("resources");
    } catch (error) {
      console.error("Resources error:", error);
      toast.error("Failed to load learning resources. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setAppState("hero");
    setRecommendations([]);
    setSelectedCareer(null);
    setLearningResources([]);
    setFormData(null);
  };

  const handleBackToResults = () => {
    setAppState("results");
    setSelectedCareer(null);
    setLearningResources([]);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {appState === "hero" && <Hero onGetStarted={handleGetStarted} />}
      
      {appState === "form" && (
        <CareerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}
      
      {appState === "results" && (
        <CareerResults
          recommendations={recommendations}
          onSelectCareer={handleSelectCareer}
          onStartOver={handleStartOver}
        />
      )}
      
      {appState === "resources" && selectedCareer && (
        <LearningResources
          career={selectedCareer}
          resources={learningResources}
          onBack={handleBackToResults}
        />
      )}

      {/* Chatbot is always visible */}
      <Chatbot />
    </div>
  );
};

export default Index;
