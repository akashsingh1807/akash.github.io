import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeUploaderProps {
  onFileUpload: (file: File) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PDF or Word document (.pdf, .doc, .docx)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);

    if (rejectedFiles.length > 0) {
      setUploadError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }

    if (acceptedFiles.length === 0) {
      setUploadError('No files selected');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) {
      setUploadError('No file selected');
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Process the file
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Call the parent handler
      onFileUpload(selectedFile);

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadProgress(0);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <File className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Upload Instructions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your current resume in PDF or Word format. Our AI will analyze and enhance it for better job opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>PDF & Word Support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>ATS Optimization</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Privacy Protected</span>
            </div>
          </div>

          {/* File Drop Zone */}
          {!selectedFile && (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop your resume here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOC, and DOCX files up to 10MB
                  </p>
                </>
              )}
            </div>
          )}

          {/* Selected File Display */}
          {selectedFile && (
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile)}
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                    </p>
                  </div>
                )}

                {/* Upload Button */}
                {!isUploading && uploadProgress === 0 && (
                  <div className="mt-4">
                    <Button onClick={handleUpload} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What Our AI Will Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Content Enhancement
              </h4>
              <p className="text-sm text-muted-foreground">
                Improve bullet points, descriptions, and overall content quality
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                ATS Optimization
              </h4>
              <p className="text-sm text-muted-foreground">
                Ensure your resume passes Applicant Tracking Systems
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Keyword Suggestions
              </h4>
              <p className="text-sm text-muted-foreground">
                Add industry-specific keywords to improve visibility
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Format Optimization
              </h4>
              <p className="text-sm text-muted-foreground">
                Professional formatting and structure improvements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
