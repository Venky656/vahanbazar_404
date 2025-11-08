import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}>
      <AlertTriangle className="w-12 h-12 text-accent" />
      <div className="text-center space-y-2">
        <h3 className="font-inter font-semibold text-lg text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground font-open-sans max-w-md">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;