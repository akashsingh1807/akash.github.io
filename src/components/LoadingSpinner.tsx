/**
 * Loading spinner components with various styles and sizes
 * Provides consistent loading states throughout the application
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { BaseComponentProps } from '@/types/common';

/**
 * Loading spinner size variants
 */
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Loading spinner variant types
 */
type SpinnerVariant = 'default' | 'dots' | 'pulse' | 'bounce';

/**
 * Loading spinner props interface
 */
interface LoadingSpinnerProps extends BaseComponentProps {
  size?: SpinnerSize | undefined;
  variant?: SpinnerVariant | undefined;
  text?: string | undefined;
  fullScreen?: boolean | undefined;
  overlay?: boolean | undefined;
}

/**
 * Size configuration for spinners
 */
const sizeConfig: Record<SpinnerSize, { spinner: string; text: string }> = {
  sm: { spinner: 'h-4 w-4', text: 'text-sm' },
  md: { spinner: 'h-6 w-6', text: 'text-base' },
  lg: { spinner: 'h-8 w-8', text: 'text-lg' },
  xl: { spinner: 'h-12 w-12', text: 'text-xl' },
};

/**
 * Default loading spinner with rotation animation
 */
const DefaultSpinner: React.FC<{ size: SpinnerSize; className?: string | undefined }> = ({ size, className }) => (
  <Loader2 className={cn(sizeConfig[size].spinner, 'animate-spin', className)} />
);

/**
 * Dots loading animation
 */
const DotsSpinner: React.FC<{ size: SpinnerSize; className?: string }> = ({ size, className }) => {
  const dotSize = size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            dotSize,
            'bg-current rounded-full animate-pulse',
            'animation-delay-' + (i * 200)
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse loading animation
 */
const PulseSpinner: React.FC<{ size: SpinnerSize; className?: string }> = ({ size, className }) => (
  <div className={cn(sizeConfig[size].spinner, 'bg-current rounded-full animate-pulse', className)} />
);

/**
 * Bounce loading animation
 */
const BounceSpinner: React.FC<{ size: SpinnerSize; className?: string }> = ({ size, className }) => {
  const ballSize = size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            ballSize,
            'bg-current rounded-full animate-bounce',
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

/**
 * Main loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  fullScreen = false,
  overlay = false,
  className,
  children,
  'data-testid': testId,
}) => {
  const renderSpinner = () => {
    const spinnerProps = { size, className: 'text-primary' };

    switch (variant) {
      case 'dots':
        return <DotsSpinner {...spinnerProps} />;
      case 'pulse':
        return <PulseSpinner {...spinnerProps} />;
      case 'bounce':
        return <BounceSpinner {...spinnerProps} />;
      default:
        return <DefaultSpinner {...spinnerProps} />;
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen && 'min-h-screen',
      className
    )} data-testid={testId}>
      {renderSpinner()}
      {text && (
        <p className={cn(
          'text-muted-foreground animate-pulse',
          sizeConfig[size].text
        )}>
          {text}
        </p>
      )}
      {children}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Inline loading spinner for buttons and small spaces
 */
export const InlineSpinner: React.FC<{
  size?: SpinnerSize;
  className?: string;
}> = ({ size = 'sm', className }) => (
  <Loader2 className={cn(sizeConfig[size].spinner, 'animate-spin', className)} />
);

/**
 * Loading skeleton for content placeholders
 */
export const LoadingSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-muted rounded animate-pulse',
          i === lines - 1 && 'w-3/4' // Last line is shorter
        )}
      />
    ))}
  </div>
);

/**
 * Loading card skeleton
 */
export const LoadingCard: React.FC<{
  showImage?: boolean;
  className?: string;
}> = ({ showImage = true, className }) => (
  <div className={cn('border rounded-lg p-6 space-y-4', className)}>
    {showImage && (
      <div className="h-48 bg-muted rounded animate-pulse" />
    )}
    <div className="space-y-2">
      <div className="h-6 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-muted rounded animate-pulse" />
      <div className="h-3 bg-muted rounded animate-pulse" />
      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
    </div>
  </div>
);

/**
 * Page loading component with progress indication
 */
export const PageLoading: React.FC<{
  progress?: number;
  message?: string;
}> = ({ progress, message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" text={message} />
      {progress !== undefined && (
        <div className="w-64 bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  </div>
);

/**
 * Suspense fallback component
 */
export const SuspenseFallback: React.FC<{
  message?: string;
}> = ({ message = 'Loading component...' }) => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner text={message} />
  </div>
);

export default LoadingSpinner;
