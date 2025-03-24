
import React from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// In a real app, this would be the path to your uploaded PDF
// For this example, we'll use a public URL path
const RESUME_PDF_URL = 'src/assets/resume.pdf';

interface PublicResumeProps {
  className?: string;
}

const PublicResume: React.FC<PublicResumeProps> = ({ className }) => {
  const handleDownloadResume = () => {
    try {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = RESUME_PDF_URL;
      link.setAttribute('download', 'akash_singh_resume.pdf');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success toast
      toast({
        title: "Resume Download Started",
        description: "Your resume download has started.",
      });
    } catch (error) {
      // Show error toast if download fails
      toast({
        title: "Download Failed",
        description: "There was an error downloading the resume. Please try again.",
        variant: "destructive",
      });
      console.error("Resume download error:", error);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleDownloadResume}
      className={className}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Download CV
    </Button>
  );
};

export default PublicResume;
