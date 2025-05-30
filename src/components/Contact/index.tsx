

import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import SocialLinks from './SocialLinks';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="mb-12 text-center">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
          Get in Touch
        </h2>
        <h3 className="section-heading">Contact Me</h3>
        <p className="section-subheading mx-auto">
          Have a project in mind or want to discuss potential opportunities? I'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <ContactInfo />
          <SocialLinks />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
