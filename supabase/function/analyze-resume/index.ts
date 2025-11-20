import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, resumeId } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Analyzing resume for user:', user.id);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert resume analyzer and career advisor with deep knowledge of the job market. Analyze the resume comprehensively and provide:

1. Extracted skills (technical and soft skills)
2. Years of experience (calculate accurately)
3. Education details with degree, institution, and year
4. Top 5 job recommendations with AI-powered matching scores based on:
   - Skills alignment
   - Experience level fit
   - Career growth potential
   - Market demand
   
Each job recommendation must include:
- title: Specific job title
- company_type: Type of companies hiring (e.g., "Tech Startups", "Fortune 500", "Agencies")
- requirements: Key requirements for the role
- salary_range: Realistic salary range based on experience and location
- match_score: Percentage match (0-100) based on resume fit
- growth_potential: Career growth opportunities (Low/Medium/High)
- why_good_fit: 2-3 sentences explaining why this is a good match

5. Key strengths from the resume
6. Areas for improvement

Return ONLY valid JSON in this exact format:
{
  "skills": ["skill1", "skill2"],
  "experience_years": 5,
  "education": [{"degree": "Bachelor's in Computer Science", "institution": "University Name", "year": "2020"}],
  "job_recommendations": [
    {
      "title": "Senior Software Engineer",
      "company_type": "Tech Companies",
      "requirements": "5+ years experience, React, Node.js, System Design",
      "salary_range": "$120k-$160k",
      "match_score": 92,
      "growth_potential": "High",
      "why_good_fit": "Your strong background in full-stack development and 5 years of experience align perfectly with this role. Your expertise in React and Node.js matches the key requirements."
    }
  ],
  "strengths": ["Strong technical skills", "Proven track record"],
  "improvements": ["Add leadership experience", "Obtain cloud certifications"]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this resume:\n\n${resumeText}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI analysis failed');
    }

    const aiData = await response.json();
    const analysisText = aiData.choices[0].message.content;
    
    console.log('Raw AI response:', analysisText);
    
    // Parse the JSON response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);

    // Store analysis in database
    const { error: dbError } = await supabase
      .from('resume_analysis')
      .insert({
        resume_id: resumeId,
        user_id: user.id,
        analysis_text: analysisText,
        skills: analysis.skills || [],
        experience_years: analysis.experience_years || 0,
        education: analysis.education || [],
        job_recommendations: analysis.job_recommendations || [],
        strengths: analysis.strengths || [],
        improvements: analysis.improvements || []
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // Update resume status
    await supabase
      .from('resumes')
      .update({ analysis_status: 'completed' })
      .eq('id', resumeId);

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});