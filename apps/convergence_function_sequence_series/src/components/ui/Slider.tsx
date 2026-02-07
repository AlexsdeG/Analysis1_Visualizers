import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className,
}) => {
  return (
    <div className={cn("space-y-3 w-full", className)}>
      <div className="flex justify-between items-center">
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {value[0]}
        </span>
      </div>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={onValueChange}
        max={max}
        min={min}
        step={step}
      >
        <SliderPrimitive.Track className="bg-slate-200 relative grow rounded-full h-[3px]">
          <SliderPrimitive.Range className="absolute bg-blue-600 rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block w-5 h-5 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform active:scale-110 cursor-grab active:cursor-grabbing"
          aria-label={label || "Volume"}
        />
      </SliderPrimitive.Root>
    </div>
  );
};