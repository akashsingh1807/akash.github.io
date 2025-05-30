import { ResumeBuilderProvider } from '@/contexts/ResumeBuilderContext';
import { ResumeBuilder } from '@/components/ResumeBuilder';

const ResumeBuilderPage = () => {
  return (
    <ResumeBuilderProvider>
      <ResumeBuilder />
    </ResumeBuilderProvider>
  );
};

export default ResumeBuilderPage;
