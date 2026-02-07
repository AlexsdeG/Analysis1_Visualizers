import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ComplexPlane } from './components/ComplexPlane';
import { calculateEstimatedRadius } from '../../lib/math-utils';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LatexDisplay } from '../../components/math/LatexDisplay';
import { Info, AlertTriangle, Lightbulb, Calculator } from 'lucide-react';
import { InfoTooltip } from '../../components/ui/InfoTooltip';
import { compile } from 'mathjs';

export const SeriesView: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [formula, setFormula] = useState('1/n'); // a_n = 1/n
  const [z, setZ] = useState<[number, number]>([0.5, 0.5]);

  // Derived State
  const radius = useMemo(() => calculateEstimatedRadius(formula), [formula]);

  // Calculation details for display
  const calcDetails = useMemo(() => {
      try {
          if (!formula || !formula.trim()) return null;
          const code = compile(formula);
          // Use n=100 for display (easier to read than 10000)
          const n = 100; 
          const an = code.evaluate({ n });
          const an_next = code.evaluate({ n: n + 1 });
          const ratio = Math.abs(an / an_next);
          return { n, an, an_next, ratio, R: radius };
      } catch (e) {
          return null;
      }
  }, [formula, radius]);

  // Determine explanation based on common inputs
  const explanationKey = useMemo(() => {
    const f = formula.replace(/\s/g, '');
    if (f === '1/n' || f === '1/(n+1)') return 'harmonic';
    if (f === '2^n') return 'geometric';
    if (f === '1/n!') return 'factorial';
    return 'standard';
  }, [formula]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Visualizer */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-1">
          <ComplexPlane 
            radius={radius}
            z={z}
            setZ={setZ}
          />
        </Card>

        {/* Math Breakdown Card */}
        <Card title={t('common.analysis')}>
          <div className="p-4 pt-0">
             <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900">
                 <Lightbulb className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                 <div>
                   <h4 className="font-semibold mb-1">
                     <LatexDisplay math={`a_n = ${formula}`} />
                   </h4>
                   <p className="text-sm">
                     {t(`modules.series.examples.${explanationKey}`)}
                   </p>
                 </div>
               </div>
          </div>
        </Card>
        
        {/* Calculation Card */}
        <Card title={t('common.calculation')}>
             <div className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t('common.general_formula')}</div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100 flex justify-center">
                         <LatexDisplay math="R = \lim_{n \to \infty} \left| \frac{a_n}{a_{n+1}} \right|" />
                    </div>
                </div>

                {calcDetails && (
                    <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t('modules.series.calc.ratio_approx')} (n={calcDetails.n})</div>
                        <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-sm font-mono overflow-x-auto">
                            <LatexDisplay 
                                math={`\\left| \\frac{${calcDetails.an.toExponential(2)}}{${calcDetails.an_next.toExponential(2)}} \\right| \\approx ${isFinite(calcDetails.ratio) ? calcDetails.ratio.toFixed(4) : '\\infty'}`} 
                                block 
                            />
                            <div className="mt-2 text-center text-blue-800">
                                <LatexDisplay math={`R \\approx ${calcDetails.R === Infinity ? '\\infty' : calcDetails.R}`} />
                            </div>
                        </div>
                    </div>
                )}
             </div>
        </Card>

        <Card title={t('modules.series.description')}>
          <div className="p-4 pt-0 text-slate-600 space-y-2">
            <p>
              {t('modules.series.info.definition_1')} <LatexDisplay math="\sum_{n=0}^{\infty} a_n z^n" /> {t('modules.series.info.definition_2')} <LatexDisplay math="|z| < R" />,
              {t('modules.series.info.definition_3')}
            </p>
            <div className="flex justify-center items-center gap-2 py-2">
              <LatexDisplay 
                math="R = \lim_{n \to \infty} \left| \frac{a_n}{a_{n+1}} \right| \quad \text{(Ratio Test)}" 
                block 
              />
              <InfoTooltip>
                {t('modules.series.info.ratio_test')}
              </InfoTooltip>
            </div>
            <p>
              {t('modules.series.info.legend_desc')}
            </p>
          </div>
        </Card>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-4" title={t('modules.series.controls.formula_label')}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                {t('modules.series.controls.input_hint')}
              </label>
              <Input
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="1/n"
                className="font-mono"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="text-sm font-medium text-slate-700 mb-1">
                {t('modules.series.controls.radius_result')}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {radius === null ? (
                   <span className="text-slate-400 text-lg">Invalid</span>
                ) : radius === Infinity ? (
                   <LatexDisplay math="\infty" />
                ) : (
                   radius
                )}
              </div>
            </div>

            {radius === Infinity && (
              <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                Converges for all <LatexDisplay math="z \in \mathbb{C}" />.
              </div>
            )}
            
            {radius === 0 && (
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                Converges only at <LatexDisplay math="z = 0" />.
              </div>
            )}
          </div>
        </Card>
        
        <div className="text-xs text-slate-400 text-center">
          {t('modules.series.info.note')}
        </div>
      </div>
    </div>
  );
};