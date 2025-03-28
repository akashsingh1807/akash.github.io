import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import emailjs from 'emailjs-com';

// EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_rzecibv';
const EMAILJS_TEMPLATE_ID = 'template_vrx5kwt';
const EMAILJS_USER_ID = 'GpVt9rYR6FaGPIV0f';

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
    // Initialize EmailJS with your user ID
    if (!emailjsInitialized) {
      emailjs.init(EMAILJS_USER_ID);
      setEmailjsInitialized(true);
    }
  }, [emailjsInitialized]);

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
      // Send email using EmailJS
      const templateParams = {
        from_name: formState.name,
        from_email: formState.email,
        subject: formState.subject,
        message: formState.message,
        reply_to: formState.email,
      };

      await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
      );

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
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
                "w-full md:w-auto px-8",
                isSubmitting && "opacity-70 cursor-not-allowed"
            )}
        >
          {isSubmitting ? (
              <>
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                  ></circle>
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </>
          ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
          )}
        </Button>
      </form>
  );
};

export default ContactForm;