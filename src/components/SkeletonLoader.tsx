import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

const SkeletonLoader = ({ 
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'md',
  animate = true
}: SkeletonLoaderProps) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div 
      className={cn(
        'bg-gradient-to-r from-muted/50 via-muted to-muted/50',
        roundedClasses[rounded],
        animate ? 'animate-pulse' : '',
        className
      )}
      style={{ width, height }}
    />
  );
};

// Predefined skeleton components for common use cases
export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-4 p-4 border rounded-lg", className)}>
    <SkeletonLoader height="1.5rem" rounded="lg" className="w-3/4" />
    <SkeletonLoader height="1rem" rounded="lg" />
    <SkeletonLoader height="1rem" rounded="lg" className="w-5/6" />
    <div className="flex space-x-2 pt-2">
      <SkeletonLoader height="2rem" width="5rem" rounded="lg" />
      <SkeletonLoader height="2rem" width="5rem" rounded="lg" />
    </div>
  </div>
);

export const ProfileSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center space-x-4 p-4 border rounded-lg", className)}>
    <SkeletonLoader width="4rem" height="4rem" rounded="full" />
    <div className="space-y-2 flex-1">
      <SkeletonLoader height="1.25rem" rounded="lg" className="w-1/2" />
      <SkeletonLoader height="1rem" rounded="lg" className="w-3/4" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3, className }: { count?: number; className?: string }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
        <SkeletonLoader width="3rem" height="3rem" rounded="lg" />
        <div className="space-y-2 flex-1">
          <SkeletonLoader height="1rem" rounded="lg" className="w-1/3" />
          <SkeletonLoader height="0.75rem" rounded="lg" className="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export const TextSkeleton = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader 
        key={index} 
        height="1rem" 
        rounded="lg" 
        className={index === 0 ? "w-5/6" : index === lines - 1 ? "w-2/3" : ""} 
      />
    ))}
  </div>
);

export default SkeletonLoader;