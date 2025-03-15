
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="mb-8">
      <p className="text-lg text-muted-foreground mb-6">
        Feel free to reach out if you're looking for a developer, have a question, or just want to connect.
      </p>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="rounded-full bg-primary/10 p-3 mr-4">
              <Mail className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h4 className="text-base font-medium mb-1">Email</h4>
            <a 
              href="mailto:Engg.akashsingh@gmail.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Engg.akashsingh@gmail.com
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="rounded-full bg-primary/10 p-3 mr-4">
              <Phone className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h4 className="text-base font-medium mb-1">Phone</h4>
            <a 
              href="tel:8948479209" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              +91 8948479209
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="rounded-full bg-primary/10 p-3 mr-4">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h4 className="text-base font-medium mb-1">Location</h4>
            <p className="text-muted-foreground">
              Bengaluru, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
