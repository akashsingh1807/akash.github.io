
import React from 'react';
import { Github, Mail } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Connect with me</h4>
      <div className="flex space-x-4">
        <a 
          href="#" 
          className="rounded-full bg-secondary p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect width="4" height="12" x="2" y="9"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a 
          href="#" 
          className="rounded-full bg-secondary p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
        <a 
          href="mailto:Engg.akashsingh@gmail.com" 
          className="rounded-full bg-secondary p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="Email"
        >
          <Mail className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
