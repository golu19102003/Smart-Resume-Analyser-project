import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, TrendingUp, DollarSign, Target } from "lucide-react";

interface JobRecommendation {
  title: string;
  company_type: string;
  requirements: string;
  salary_range: string;
  match_score?: number;
  growth_potential?: string;
  why_good_fit?: string;
}

interface JobRecommendationsProps {
  recommendations: JobRecommendation[];
}

const JobRecommendations = ({ recommendations }: JobRecommendationsProps) => {
  const getGrowthColor = (growth?: string) => {
    switch (growth?.toLowerCase()) {
      case 'high': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">AI-Powered Job Recommendations</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {recommendations.map((job, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-xl mb-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-base">{job.company_type}</CardDescription>
                </div>
                {job.match_score !== undefined && (
                  <div className="flex flex-col items-center gap-1 min-w-[80px]">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {job.match_score}%
                    </div>
                    <span className="text-xs text-muted-foreground">Match Score</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {job.match_score !== undefined && (
                <div className="space-y-2">
                  <Progress value={job.match_score} className="h-2" />
                </div>
              )}

              {job.why_good_fit && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm leading-relaxed">{job.why_good_fit}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Requirements</p>
                    <p className="text-sm">{job.requirements}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Salary Range</p>
                    <p className="text-sm font-semibold text-primary">{job.salary_range}</p>
                  </div>
                </div>

                {job.growth_potential && (
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Growth Potential</p>
                      <Badge variant="outline" className={getGrowthColor(job.growth_potential)}>
                        {job.growth_potential}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;
