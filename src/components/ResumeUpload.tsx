import { useState } from "react";
import { supabase } from "@/integration/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from "lucide-react";

interface ResumeUploadProps {
  userId: string;
}

const ResumeUpload = ({ userId }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 10485760) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    setUploading(true);

    try {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: resumeData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          analysis_status: 'pending',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful",
        description: "Your resume has been uploaded. Starting analysis...",
      });

      setUploading(false);
      setAnalyzing(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        const { data: { session } } = await supabase.auth.getSession();
        
        const { data, error: analyzeError } = await supabase.functions.invoke('analyze-resume', {
          body: { 
            resumeText: text,
            resumeId: resumeData.id 
          },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        setAnalyzing(false);

        if (analyzeError) {
          toast({
            title: "Analysis Failed",
            description: analyzeError.message,
            variant: "destructive",
          });
          return;
        }

        if (data?.error) {
          toast({
            title: "Analysis Error",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Analysis Complete!",
          description: "Your resume has been analyzed. Check the results below.",
        });

        setFile(null);
        window.location.reload();
      };

      reader.readAsText(file);

    } catch (error) {
      setUploading(false);
      setAnalyzing(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload resume",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Upload Resume
        </CardTitle>
        <CardDescription>
          Upload your resume in PDF or Word format (max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
            disabled={uploading || analyzing}
          />
          <label
            htmlFor="resume-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {file ? file.name : "Click to upload or drag and drop"}
            </p>
          </label>
        </div>

        {file && (
          <Button
            onClick={handleUpload}
            disabled={uploading || analyzing}
            className="w-full"
            size="lg"
          >
            {uploading || analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? "Uploading..." : "Analyzing..."}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Analyze
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;