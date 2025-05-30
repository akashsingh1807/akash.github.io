import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ResumeEnhancer } from '@/components/ResumeEnhancer';

const Resume = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto pt-20 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <ResumeEnhancer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resume;
