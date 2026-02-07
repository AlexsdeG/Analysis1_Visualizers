import React, { useState, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Mafs, Coordinates, Plot, Theme } from 'mafs';
import { useFunctionSequence } from './hooks/useFunctionSequence';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Slider } from '../../components/ui/Slider';
import { Button } from '../../components/ui/Button';
import { LatexDisplay } from '../../components/math/LatexDisplay';
import { InfoTooltip } from '../../components/ui/InfoTooltip';
import { ArrowRight, BookOpen, AlertTriangle, CheckCircle2, Calculator } from 'lucide-react';

export const FunctionSeqView: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [n, setN] = useState(1);
  const [formulaFn, setFormulaFn] = useState('x^n');
  const [formulaLimit, setFormulaLimit] = useState('0'); 
  const [presetDescription, setPresetDescription] = useState(t('modules.functions.presets.xn_desc'));

  // Hooks
  const sequence = useFunctionSequence(formulaFn, n);
  const limit = useFunctionSequence(formulaLimit, 1);

  // Analyze the distance (Supremum Norm) on interval [0, 1]
  const analysis = useMemo(() => {
    if (sequence.error || limit.error) return null;
    
    let maxDiff = 0;
    const samples = 50; // Check 50 points
    for (let i = 0; i <= samples; i++) {
        const x = i / samples; // 0.0, 0.02, ..., 1.0
        const ySeq = sequence.fn(x);
        const yLim = limit.fn(x);
        
        if (!isNaN(ySeq) && !isNaN(yLim)) {
            const diff = Math.abs(ySeq - yLim);
            if (diff > maxDiff) maxDiff = diff;
        }
    }
    return { maxDiff };
  }, [sequence.fn, limit.fn, sequence.error, limit.error]);

  const applyPreset = (fn: string, lim: string, desc: string) => {
    setFormulaFn(fn);
    setFormulaLimit(lim);
    setPresetDescription(desc);
    setN(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Visualization */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-1">
          <div className="h-[400px] w-full border border-slate-200 rounded-lg overflow-hidden bg-white relative">
            <Mafs
              zoom={{ min: 0.1, max: 10 }}
              pan={true}
              viewBox={{ x: [-0.2, 1.2], y: [-0.5, 1.5] }}
              preserveAspectRatio={false}
            >
              <Coordinates.Cartesian
                subdivisions={2}
              />
              
              {/* Limit Function (Ghost) */}
              {!limit.error && (
                <Plot.OfX
                  y={limit.fn}
                  color="#94a3b8" // Slate-400 equivalent for "gray"
                  style="dashed"
                  opacity={0.5}
                />
              )}

              {/* Sequence Function f_n(x) */}
              {!sequence.error && (
                <Plot.OfX
                  y={sequence.fn}
                  color="#2563eb" // math-primary
                  weight={3}
                />
              )}
            </Mafs>

            {/* Legend Overlay */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded border border-slate-100 shadow-sm text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-600 rounded"></div>
                <span className="font-medium">
                  <LatexDisplay math={`f_{${n}}(x)`} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-slate-400 border-dashed border-b-2 border-slate-400"></div>
                <span className="font-medium text-slate-500">
                  <LatexDisplay math="f(x)" />
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Dynamic Analysis Card */}
        {analysis && (
            <Card title={t('common.analysis')}>
                <div className="p-4 pt-0">
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                {t('modules.functions.analysis.supremum')}
                                <InfoTooltip>{t('modules.functions.analysis.sup_explanation')}</InfoTooltip>
                            </h4>
                        </div>
                        <div className="flex-1 ml-6 text-sm">
                            {analysis.maxDiff < 0.1 ? (
                                <div className="text-green-700 flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    {t('modules.functions.analysis.uniform_conclusion')}
                                </div>
                            ) : (
                                <div className="text-amber-700 flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 shrink-0" />
                                    {t('modules.functions.analysis.pointwise_conclusion')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        )}

         {/* Calculation Card */}
         {analysis && (
            <Card title={t('common.calculation')}>
                <div className="p-4 pt-0 space-y-4">
                     <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t('common.general_formula')}</div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-100 flex justify-center">
                            <LatexDisplay math="d_n = \sup_{x \in [0,1]} |f_n(x) - f(x)|" />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t('common.current_values')} (n={n})</div>
                         <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-sm font-mono flex justify-between items-center">
                            <span>Max Distance found:</span>
                            <span className="text-xl font-bold text-blue-600">{analysis.maxDiff.toFixed(4)}</span>
                         </div>
                    </div>
                </div>
            </Card>
         )}

        {/* Step-by-Step Guide Card */}
        <Card title={t('common.goal')}>
            <div className="p-4 pt-0">
                <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <BookOpen className="w-6 h-6 text-slate-400 shrink-0 mt-1" />
                    <div className="text-sm space-y-2 text-slate-700">
                        <h4 className="font-semibold text-slate-900">{t('modules.functions.guide.title')}</h4>
                        <p>{t('modules.functions.guide.step1')}</p>
                        <p>{t('modules.functions.guide.step2')}</p>
                        <p>{t('modules.functions.guide.step3')}</p>
                        <div className="pt-2 border-t border-slate-200">
                           <p className="font-medium text-slate-900">{t('modules.functions.guide.step4')}</p>
                           <ul className="list-disc list-inside mt-1 ml-2 text-slate-600">
                              <li>{t('modules.functions.guide.check_yes')}</li>
                              <li>{t('modules.functions.guide.check_no')}</li>
                           </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
      </div>

      {/* Right: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <Card title={t('modules.functions.controls.title')} className="p-4">
          <div className="space-y-6">
            
            {/* Presets */}
            <div className="space-y-2 pb-4 border-b border-slate-100">
                <label className="text-sm font-medium text-slate-700">{t('modules.functions.controls.presets')}</label>
                <div className="grid grid-cols-1 gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => applyPreset('x^n', '0', t('modules.functions.presets.xn_desc'))}
                        className="justify-between"
                    >
                        <span>Example 1: <LatexDisplay math="x^n" /></span>
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => applyPreset('x/n', '0', t('modules.functions.presets.inv_desc'))}
                        className="justify-between"
                    >
                        <span>Example 2: <LatexDisplay math="x/n" /></span>
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </div>
                {presetDescription && (
                    <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded">
                        {presetDescription}
                    </p>
                )}
            </div>

            {/* Formula Input */}
            <Input
              label={t('modules.functions.controls.formula_label')}
              value={formulaFn}
              onChange={(e) => setFormulaFn(e.target.value)}
              placeholder="x^n"
              error={sequence.error || undefined}
            />

            {/* Limit Input */}
            <Input
              label={t('modules.functions.controls.limit_label')}
              value={formulaLimit}
              onChange={(e) => setFormulaLimit(e.target.value)}
              placeholder="0"
              error={limit.error || undefined}
            />

            {/* Slider N */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-700">
                  <LatexDisplay math="n" /> {t('modules.functions.controls.n_label')}
                </label>
              </div>
              <Slider
                value={[n]}
                onValueChange={(val) => setN(val[0])}
                min={1}
                max={100}
                step={1}
              />
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
};