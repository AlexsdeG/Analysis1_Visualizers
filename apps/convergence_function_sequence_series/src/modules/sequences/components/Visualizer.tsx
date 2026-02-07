import React, { useState } from 'react';
import { Mafs, Coordinates, Point, Polygon, Line, Text } from 'mafs';
import { SequencePoint } from '../hooks/useSequenceData';
import { useTranslation } from 'react-i18next';

interface VisualizerProps {
  data: SequencePoint[];
  limit: number;
  epsilon: number;
  N: number;
  setN: (val: number) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  data,
  limit,
  epsilon,
  N,
  setN,
}) => {
  const { t } = useTranslation();
  const [hoveredElement, setHoveredElement] = useState<'tube' | 'barrier' | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<SequencePoint | null>(null);
  
  // Define colors from CSS variables (approximate for JS side)
  const colors = {
    primary: '#2563eb',
    success: '#16a34a',
    danger: '#dc2626',
    neutral: '#94a3b8',
    // Brighter orange for epsilon tube
    tube: 'rgba(255, 165, 0, 0.25)', 
    tubeHighlight: 'rgba(255, 165, 0, 0.4)', 
    barrierHighlight: '#475569', // Slate-600
  };

  const maxY = Math.max(limit + epsilon + 1, ...data.map(d => d.output || 0).filter(v => v < 10));
  const minY = Math.min(limit - epsilon - 1, ...data.map(d => d.output || 0).filter(v => v > -10));
  
  // Clamp zoom range
  const viewBoxY = [Math.max(-10, minY), Math.min(10, maxY)] as [number, number];

  return (
    <div className="h-[400px] w-full border border-slate-200 rounded-lg overflow-hidden bg-white relative">
      <Mafs
        zoom={{ min: 0.5, max: 2 }}
        pan={true}
        viewBox={{ x: [0, 52], y: viewBoxY }}
        preserveAspectRatio={false}
      >
        <Coordinates.Cartesian
          subdivisions={1}
        />

        {/* Epsilon Tube (Orange Area) */}
        <Polygon
          points={[
            [0, limit - epsilon],
            [55, limit - epsilon],
            [55, limit + epsilon],
            [0, limit + epsilon],
          ]}
          color={hoveredElement === 'tube' ? colors.tubeHighlight : colors.tube}
          strokeStyle="dashed"
          strokeOpacity={0.5}
        />
        
        {/* Limit Line (Blue) */}
        <Line.Segment
          point1={[0, limit]}
          point2={[55, limit]}
          style="dashed"
          color={colors.primary}
          opacity={0.5}
        />

        {/* N Barrier */}
        <Line.Segment
           point1={[N, -100]}
           point2={[N, 100]}
           color={hoveredElement === 'barrier' ? colors.barrierHighlight : colors.neutral}
           style="dashed"
           weight={hoveredElement === 'barrier' ? 3 : 1}
        />
        <Text x={N + 0.5} y={viewBoxY[1] - 0.5} attach="ne">
          N = {N}
        </Text>

        {/* Sequence Points */}
        {data.map((pt) => {
          if (pt.output === null) return null;
          
          let color = colors.neutral;
          if (pt.status === 'success') color = colors.success;
          if (pt.status === 'danger') color = colors.danger;
          
          const isHovered = hoveredPoint?.input === pt.input;

          return (
            <React.Fragment key={pt.input}>
              <Point
                x={pt.input}
                y={pt.output}
                color={color}
                opacity={1}
                // @ts-ignore - Mafs types allow svg handlers
                svgPointProps={{
                  r: isHovered ? 6 : 4,
                  style: { cursor: 'pointer', transition: 'r 0.2s ease' },
                  onMouseEnter: () => setHoveredPoint(pt),
                  onMouseLeave: () => setHoveredPoint(null)
                }}
              />
              {isHovered && (
                <g>
                    {/* Tooltip Background */}
                    <Text 
                        x={pt.input} 
                        y={pt.output} 
                        attach="s" 
                        size={12}
                        color={color}
                        svgTextProps={{ fontWeight: 700 }}
                    >
                        {`n=${pt.input}, y ≈ ${pt.output.toFixed(4)}`}
                    </Text>
                </g>
              )}
            </React.Fragment>
          );
        })}
      </Mafs>
      
      {/* Legend Overlay */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded border border-slate-100 text-xs shadow-sm flex flex-col gap-1">
        <div 
          className="flex items-center gap-2 p-1 rounded hover:bg-slate-100 cursor-pointer transition-colors"
          onMouseEnter={() => setHoveredElement('tube')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="w-3 h-3 bg-orange-200 border border-orange-400"></div>
          <span>{t('modules.sequences.legend.tube')}</span>
        </div>
        <div 
          className="flex items-center gap-2 p-1 rounded hover:bg-slate-100 cursor-pointer transition-colors"
          onMouseEnter={() => setHoveredElement('barrier')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="w-3 h-3 border-l-2 border-slate-400 border-dashed"></div>
          <span>{t('modules.sequences.legend.barrier')}</span>
        </div>
      </div>
    </div>
  );
};