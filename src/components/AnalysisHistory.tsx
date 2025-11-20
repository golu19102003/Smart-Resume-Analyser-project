import { useState, useEffect } from "react";
import { supabase } from "@/integration/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Calendar,
  Award, 
  TrendingUp, 
  AlertCircle
} from "lucide-react";
import JobRecommendations from "./JobRecommendations";

interface AnalysisHistoryProps {
  userId: string;
}

interface Analysis {
  id: string;
  resume_id: string;
  skills: string[];
  experience_years: number;
  education: Array<{ degree: string; institution: string; year: string }>;
  job_recommendations: Array<{
    title: string;
    company_type: string;
    requirements: string;
    salary_range: string;
  }>;
  strengths: string[];
  improvements: string[];
  created_at: string;
  resumes: {
    file_name: string;
    upload_date: string;
  };
}

const AnalysisHistory = ({ userId }: AnalysisHistoryProps) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, [userId]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_analysis')
        .select(`
          *,
          resumes (
            file_name,
            upload_date
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses((data || []) as unknown as Analysis[]);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No analyses yet. Upload a resume to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {analyses.map((analysis) => (
        <Card key={analysis.id} className="border-2 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  {analysis.resumes.file_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(analysis.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {analysis.experience_years} years
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Job Recommendations - Featured Section */}
            {analysis.job_recommendations && Array.isArray(analysis.job_recommendations) && analysis.job_recommendations.length > 0 && (
              <div>
                <JobRecommendations 
                  recommendations={analysis.job_recommendations as unknown as Array<{
                    title: string;
                    company_type: string;
                    requirements: string;
                    salary_range: string;
                    match_score?: number;
                    growth_potential?: string;
                    why_good_fit?: string;
                  }>} 
                />
                <Separator className="my-6" />
              </div>
            )}

            {/* Skills */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-primary" />
                Skills & Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.skills || []).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education */}
            {analysis.education && Array.isArray(analysis.education) && analysis.education.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Education</h4>
                <div className="space-y-3">
                  {(analysis.education || []).map((edu, idx) => (
                    <Card key={idx} className="bg-muted/30">
                      <CardContent className="pt-4">
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.institution} • {edu.year}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(analysis.strengths || []).map((strength, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="h-4 w-4" />
                    Growth Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(analysis.improvements || []).map((improvement, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalysisHistory;