import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../components/ui/Input';
import { Slider } from '../../../components/ui/Slider';
import { LatexDisplay } from '../../../components/math/LatexDisplay';
import { Card } from '../../../components/ui/Card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ControlsProps {
  formula: string;
  setFormula: (val: string) => void;
  limitGuess: number;
  setLimitGuess: (val: number) => void;
  epsilon: number;
  setEpsilon: (val: number) => void;
  N: number;
  setN: (val: number) => void;
  isConvergent: boolean;
  hasError: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  formula,
  setFormula,
  limitGuess,
  setLimitGuess,
  epsilon,
  setEpsilon,
  N,
  setN,
  isConvergent,
  hasError,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <Input
            label={t('modules.sequences.controls.formula_label')}
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="(1 + 1/n)^n"
          />
          <Input
            label={t('modules.sequences.controls.limit_label')}
            type="number"
            step="0.1"
            value={limitGuess}
            onChange={(e) => setLimitGuess(parseFloat(e.target.value))}
          />
        </div>
      </Card>

      <Card className="p-4 bg-slate-50/50">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700">
                <LatexDisplay math="\epsilon" /> {t('modules.sequences.controls.epsilon_label')}
              </label>
            </div>
            <Slider
              value={[epsilon]}
              onValueChange={(val) => setEpsilon(val[0])}
              min={0.01}
              max={2}
              step={0.01}
            />
          </div>

          <div className="space-y-2">
             <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700">
                 <LatexDisplay math="N" /> {t('modules.sequences.controls.n_label')}
              </label>
            </div>
            <Slider
              value={[N]}
              onValueChange={(val) => setN(val[0])}
              min={1}
              max={50}
              step={1}
            />
          </div>
        </div>
      </Card>

      <div className={`p-4 rounded-lg flex items-center gap-3 border ${
        hasError 
          ? 'bg-amber-50 border-amber-200 text-amber-800'
          : isConvergent 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {hasError ? (
           <AlertCircle className="w-5 h-5" />
        ) : isConvergent ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span className="font-medium">
          {hasError 
            ? t('modules.sequences.status.invalid') 
            : isConvergent 
              ? t('modules.sequences.status.convergent') 
              : t('modules.sequences.status.divergent')
          }
        </span>
      </div>
    </div>
  );
};