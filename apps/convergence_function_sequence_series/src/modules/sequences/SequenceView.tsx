import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSequenceData } from './hooks/useSequenceData';
import { Visualizer } from './components/Visualizer';
import { Controls } from './components/Controls';
import { Card } from '../../components/ui/Card';
import { LatexDisplay } from '../../components/math/LatexDisplay';
import { AlertCircle, CheckCircle2, Calculator } from 'lucide-react';

export const SequenceView: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [formula, setFormula] = useState('(1 + 1/n)^n');
  const [limitGuess, setLimitGuess] = useState(2.718); // e
  const [epsilon, setEpsilon] = useState(0.1);
  const [N, setN] = useState(10);

  // Data Hook
  const { data, error, isConvergent, firstViolation } = useSequenceData(formula, limitGuess, epsilon, N);

  // Get data point at N+1 for example calculation
  const checkPoint = data.find(p => p.input === N + 1) || data[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-1">
           <Visualizer 
             data={data}
             limit={limitGuess}
             epsilon={epsilon}
             N={N}
             setN={setN}
           />
        </Card>
        
        {/* Analysis Card */}
        <Card title={t('common.analysis')}>
          <div className="p-4 pt-0">
             {isConvergent ? (
               <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100 text-green-900">
                 <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-green-600" />
                 <div>
                   <h4 className="font-semibold mb-1">{t('modules.sequences.analysis.success_title')}</h4>
                   <p className="text-sm">{t('modules.sequences.analysis.success_desc')}</p>
                 </div>
               </div>
             ) : (
               <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-900">
                 <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                 <div>
                   <h4 className="font-semibold mb-1">{t('modules.sequences.analysis.failure_title')}</h4>
                   <p className="text-sm mb-2">{t('modules.sequences.analysis.failure_desc')}</p>
                   {firstViolation && (
                     <p className="text-sm font-mono bg-white/50 p-2 rounded">
                       {t('modules.sequences.analysis.violation_detail', { 
                         n: firstViolation.input, 
                         val: firstViolation.output?.toFixed(4),
                         min: (limitGuess - epsilon).toFixed(2),
                         max: (limitGuess + epsilon).toFixed(2)
                       })}
                     </p>
                   )}
                 </div>
               </div>
             )}
          </div>
        </Card>

        {/* Calculation Card */}
        {checkPoint && checkPoint.output !== null && (
            <Card title={t('common.calculation')}>
                <div className="p-4 pt-0 space-y-4">
                    {/* General Formula */}
                    <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t('common.general_formula')}</div>
                        <div className="bg-slate-50 p-3 rounded border border-slate-100 flex justify-center">
                            <LatexDisplay math="|a_n - a| < \epsilon" />
                        </div>
                    </div>

                    {/* Specific Calculation */}
                    <div className="space-y-2">
                         <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t('common.current_values')} (n = {checkPoint.input})</div>
                         <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-sm">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                                    <span>{t('modules.sequences.calc.distance')}:</span>
                                    <span className="font-mono">
                                        <LatexDisplay math={`|${checkPoint.output.toFixed(4)} - ${limitGuess}| = ${Math.abs(checkPoint.output - limitGuess).toFixed(4)}`} />
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>{t('modules.sequences.controls.epsilon_label')}:</span>
                                    <span className="font-mono">{epsilon}</span>
                                </div>
                                <div className={`flex justify-between items-center font-semibold ${Math.abs(checkPoint.output - limitGuess) < epsilon ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>Result:</span>
                                    <span>
                                        {Math.abs(checkPoint.output - limitGuess).toFixed(4)} {Math.abs(checkPoint.output - limitGuess) < epsilon ? '<' : '>'} {epsilon}
                                    </span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </Card>
        )}

        <Card title={t('modules.sequences.description')}>
          <div className="p-4 pt-0 text-slate-600 space-y-2">
            <p>
              {t('modules.sequences.info.definition')} <LatexDisplay math="(a_n)" />:
            </p>
            <div className="flex justify-center py-2">
              <LatexDisplay 
                math="\forall \epsilon > 0, \exists N \in \mathbb{N}, \forall n > N : |a_n - a| < \epsilon" 
                block 
              />
            </div>
            <p>
              {t('modules.sequences.info.explanation_1')} <LatexDisplay math="\epsilon" /> {t('modules.sequences.info.explanation_2')} <LatexDisplay math="N" />, {t('modules.sequences.info.explanation_3')}
            </p>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Controls 
          formula={formula}
          setFormula={setFormula}
          limitGuess={limitGuess}
          setLimitGuess={setLimitGuess}
          epsilon={epsilon}
          setEpsilon={setEpsilon}
          N={N}
          setN={setN}
          isConvergent={isConvergent}
          hasError={!!error}
        />
      </div>
    </div>
  );
};