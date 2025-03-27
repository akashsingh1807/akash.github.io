
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsComponent from '@/components/Projects';

const ProjectsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <ProjectsComponent />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
