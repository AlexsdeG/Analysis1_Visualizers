import React, { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends PropsWithChildren {
  className?: string;
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({ className, title, description, children }) => {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden', className)}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-slate-100">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-0">
        {children}
      </div>
    </div>
  );
};