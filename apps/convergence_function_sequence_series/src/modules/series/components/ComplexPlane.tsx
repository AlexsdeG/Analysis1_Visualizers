import React from 'react';
import { Mafs, Coordinates, Circle, MovablePoint, Text, Polygon, Theme } from 'mafs';
import { useTranslation } from 'react-i18next';

interface ComplexPlaneProps {
  radius: number | null; // null means invalid/calculating, Infinity means... infinity.
  z: [number, number];
  setZ: (point: [number, number]) => void;
}

export const ComplexPlane: React.FC<ComplexPlaneProps> = ({ radius, z, setZ }) => {
  const { t } = useTranslation();

  // Color Constants
  const colors = {
    region: 'rgba(22, 163, 74, 0.2)', // Green-ish transparent
    regionBorder: '#16a34a',
    point: '#2563eb', // Blue
    divergent: '#dc2626',
  };

  const isFiniteRadius = radius !== null && isFinite(radius);
  const isInfiniteRadius = radius === Infinity;
  
  const zMagnitude = Math.sqrt(z[0]**2 + z[1]**2);
  
  // Determine point status color
  let pointColor = colors.point;
  if (radius !== null) {
    if (radius === Infinity) {
      pointColor = colors.regionBorder; // Always convergent
    } else {
      pointColor = zMagnitude < radius ? colors.regionBorder : colors.divergent;
    }
  }

  // Calculate dynamic viewbox based on radius or point position
  let zoomMax = 5;
  if (isFiniteRadius && radius > 0) {
    zoomMax = Math.max(3, radius * 1.5);
  }
  
  return (
    <div className="h-[400px] w-full border border-slate-200 rounded-lg overflow-hidden bg-white relative">
      <Mafs
        zoom={{ min: 0.5, max: zoomMax }}
        pan={true}
        viewBox={{ x: [-3, 3], y: [-3, 3] }}
        preserveAspectRatio="contain"
      >
        <Coordinates.Cartesian
          subdivisions={1}
        />

        {/* Infinite Convergence Region (Background overlay if R=Infinity) */}
        {isInfiniteRadius && (
          <Polygon
            points={[
              [-100, -100],
              [100, -100],
              [100, 100],
              [-100, 100]
            ]}
            color={colors.region}
          />
        )}

        {/* Convergence Circle */}
        {isFiniteRadius && radius > 0 && (
          <Circle
            center={[0, 0]}
            radius={radius}
            color={colors.regionBorder}
            fillOpacity={0.2}
            weight={2}
          />
        )}

        {/* The Test Point z */}
        <MovablePoint
          point={z}
          onMove={setZ}
          color={pointColor}
        />

        {/* Labels */}
        <Text x={z[0]} y={z[1]} attach="se" size={14}>
          z
        </Text>
        
        {isFiniteRadius && radius > 0 && (
          <Text x={radius * 0.7} y={radius * 0.7} attach="nw" color={colors.regionBorder}>
            R = {radius}
          </Text>
        )}

      </Mafs>

      {/* Stats Overlay */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-3 rounded border border-slate-100 shadow-sm text-sm font-mono space-y-1">
        <div>|z| = {zMagnitude.toFixed(3)}</div>
        <div>
          Status: <span style={{ color: pointColor, fontWeight: 'bold' }}>
            {radius === null 
              ? '?' 
              : (zMagnitude < radius || radius === Infinity) 
                ? t('modules.series.status.convergent') 
                : t('modules.series.status.divergent')
            }
          </span>
        </div>
      </div>
    </div>
  );
};