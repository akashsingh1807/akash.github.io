
import React from 'react';
import { Github, Mail, Linkedin } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Connect with me</h4>
      <div className="flex space-x-4">
        <a 
          href="https://www.linkedin.com/in/itsmeakashsingh/" 
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-secondary p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
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
