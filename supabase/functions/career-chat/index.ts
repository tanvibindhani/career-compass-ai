import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "chat") {
      systemPrompt = `You are a friendly and knowledgeable career guidance assistant. Your role is to:
1. Help users navigate the career guidance platform
2. Clarify career recommendations and explain why certain careers might be a good fit
3. Answer general career-related questions
4. Provide advice on skill development and career transitions
5. Be encouraging and supportive while being realistic

Keep your responses concise, helpful, and conversational. Use markdown formatting when helpful (bullet points, bold for emphasis). 
If asked about specific job applications or company-specific questions, remind users to research those companies directly.`;
    } else if (type === "analyze") {
      systemPrompt = `You are a career analysis AI. Based on the user's profile (education, skills, interests, and preferred industries), 
you will recommend 3-5 suitable career paths. For each career, provide:
1. A clear job title
2. A match score (0-100) based on how well it fits the user's profile
3. A brief rationale explaining why this career is a good match
4. 3-5 relevant skills the user already has or should develop
5. Growth potential (High/Medium/Low with brief explanation)
6. Typical salary range
7. Estimated time to transition into this role

Format your response as a JSON array with the following structure:
{
  "careers": [
    {
      "title": "Career Title",
      "matchScore": 85,
      "rationale": "Brief explanation of why this career matches...",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "growthPotential": "High - explanation",
      "salaryRange": "$X - $Y",
      "timeToTransition": "6-12 months"
    }
  ]
}

Be realistic and thoughtful in your recommendations. Consider current job market trends and the user's background.`;
    } else if (type === "resources") {
      systemPrompt = `You are a learning resource recommendation AI. Based on the selected career path and the user's current skills.

IMPORTANT: First, determine if the career falls into one of these EXAM-BASED or STRUCTURED PATHWAY categories:
- Government jobs (civil services, public sector, administrative roles)
- Military careers (armed forces, defense services)
- Law enforcement (police, FBI, customs, border patrol)
- Medical/Healthcare licensing (doctors, nurses, pharmacists)
- Legal professions (bar exam required)
- Accounting/CPA roles
- Teaching (requiring state certification exams)
- Aviation (pilots, air traffic control)
- Engineering licensing (PE exam)

IF THE CAREER IS EXAM-BASED/STRUCTURED PATHWAY:
Set "isExamBased": true and provide resources focused on:
- Official government/organization preparation materials
- YouTube channels dedicated to exam preparation
- Free video lectures and tutorials
- Official syllabus and study guides
- Practice test platforms

Use these providers for exam-based careers:
- YouTube (specific channels like Khan Academy, official government channels)
- Official (government websites, official preparation portals)
- Free platforms (NPTEL, MIT OCW, government e-learning portals)

IF THE CAREER HAS TRADITIONAL LEARNING PATHS:
Set "isExamBased": false and
recommend 4-6 learning resources from platforms like Coursera, Forage, Udemy, LinkedIn Learning, edX, and Google.
Include a mix of:
- Online courses for theoretical knowledge
- Job simulations (especially from Forage) for hands-on experience
- Certifications for credibility
- Bootcamps for intensive learning (if appropriate)

Format your response as a JSON array:
{
  "isExamBased": false,
  "pathwayMessage": "Optional message explaining the pathway type, required if isExamBased is true",
  "resources": [
    {
      "title": "Resource Title",
      "provider": "Platform Name",
      "type": "course|simulation|certification|bootcamp|video|official",
      "duration": "Estimated time",
      "rating": 4.5,
      "skills": ["Skill 1", "Skill 2"],
      "url": "https://example.com/course",
      "description": "Brief description of what the user will learn"
    }
  ]
}

For exam-based careers, include a "pathwayMessage" explaining that this career follows a structured/exam-based pathway and what steps the user should take (e.g., "This career requires passing the UPSC Civil Services Examination. We recommend starting with official syllabus materials and YouTube preparation channels.").

Focus on high-quality, reputable resources that will genuinely help the user develop relevant skills or prepare for required examinations.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Career chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
