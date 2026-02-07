import React from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { cn } from '../../lib/utils';

interface InfoTooltipProps {
  children: React.ReactNode;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ children, className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn("inline-flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors ml-1 cursor-help", className)} aria-label="Information">
          <Info className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-sm text-slate-600 leading-relaxed">
        {children}
      </PopoverContent>
    </Popover>
  );
};