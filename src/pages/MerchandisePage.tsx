
import React from 'react';
import MerchandiseStore from '@/components/MerchandiseStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MerchandisePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main className="overflow-x-hidden">
        <MerchandiseStore />
      </main>
      <Footer />
    </div>
  );
};

export default MerchandisePage;
