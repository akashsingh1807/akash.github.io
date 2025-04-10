
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import emailjs from '@emailjs/browser';

// EmailJS credentials from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

// Formspree endpoint from environment variables
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

// Validate required environment variables
const validateEnvVariables = () => {
  const missingVars = [];
  if (!FORMSPREE_ENDPOINT) missingVars.push('VITE_FORMSPREE_ENDPOINT');
  if (!EMAILJS_SERVICE_ID) missingVars.push('VITE_EMAILJS_SERVICE_ID');
  if (!EMAILJS_TEMPLATE_ID) missingVars.push('VITE_EMAILJS_TEMPLATE_ID');
  if (!EMAILJS_USER_ID) missingVars.push('VITE_EMAILJS_USER_ID');
  return missingVars;
};

const ContactForm = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailjsInitialized, setEmailjsInitialized] = useState(false);

  useEffect(() => {
    // Check for missing environment variables
    const missingVars = validateEnvVariables();
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      toast({
        title: "Configuration Error",
        description: "Contact form is not properly configured. Please check the environment variables.",
        variant: "destructive",
      });
      return;
    }

    // Initialize EmailJS with your user ID
    if (!emailjsInitialized) {
      try {
        emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);
        setEmailjsInitialized(true);
        console.log('EmailJS initialized successfully');
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize the contact form service.",
          variant: "destructive",
        });
      }
    }
  }, [emailjsInitialized, toast]);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting to send email with EmailJS...');
      
      // Try EmailJS first
      const templateParams = {
        from_name: formState.name,
        from_email: formState.email,
        subject: formState.subject,
        message: formState.message,
        reply_to: formState.email,
      };

      const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
      );
      
      console.log('EmailJS sent successfully:', response);

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message via EmailJS. I'll get back to you soon.",
        variant: "default",
      });

      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (emailjsError) {
      console.error('EmailJS failed, trying Formspree:', emailjsError);
      toast({
        title: "Retrying via backup service",
        description: "EmailJS submission failed, attempting Formspree...",
        variant: "destructive",
      });
      
      // Fallback to Formspree
      try {
        const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            subject: formState.subject,
            message: formState.message,
          }),
        });

        if (formspreeResponse.ok) {
          console.log('Formspree sent successfully');
          toast({
            title: "Message sent successfully!",
            description: "Thank you for your message. I'll get back to you soon.",
            variant: "default",
          });
          
          setFormState({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
        } else {
          throw new Error('Formspree submission failed');
        }
      } catch (formspreeError) {
        console.error('Both EmailJS and Formspree failed:', formspreeError);
        toast({
          title: "Failed to send message",
          description: "There was an error sending your message. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                value={formState.name}
                onChange={handleChange}
                className="border-border/60 focus-visible:ring-1"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                required
                value={formState.email}
                onChange={handleChange}
                className="border-border/60 focus-visible:ring-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
              id="subject"
              name="subject"
              placeholder="Message subject"
              required
              value={formState.subject}
              onChange={handleChange}
              className="border-border/60 focus-visible:ring-1"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <Textarea
              id="message"
              name="message"
              placeholder="Your message"
              required
              rows={6}
              value={formState.message}
              onChange={handleChange}
              className="border-border/60 focus-visible:ring-1 resize-none"
          />
        </div>
        <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
                "w-full gap-2 transition-all",
                isSubmitting ? "bg-blue-600/90" : "bg-primary/90 hover:bg-primary"
            )}
        >
          {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending message...
              </>
          ) : (
              <>
                <Send className="h-5 w-5" />
                Send Message
              </>
          )}
        </Button>
      </form>
  );
};

export default ContactForm;
