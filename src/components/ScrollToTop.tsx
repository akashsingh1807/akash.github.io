
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > (isMobile ? 300 : 500)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Enhanced smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [isMobile]);

  return (
    <div className={cn(
      'fixed z-50 transition-all duration-300 safe-bottom safe-right',
      isMobile ? 'right-4 bottom-20' : 'right-6 bottom-6',
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    )}>
      <Button
        onClick={scrollToTop}
        size={isMobile ? "default" : "icon"}
        className={cn(
          'rounded-full shadow-lg touch-button backdrop-blur-sm bg-primary/90 hover:bg-primary text-primary-foreground',
          isMobile ? 'h-12 w-12' : 'h-10 w-10'
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp className={cn('h-5 w-5', isMobile && 'h-6 w-6')} />
      </Button>
    </div>
  );
};

export default ScrollToTop;
