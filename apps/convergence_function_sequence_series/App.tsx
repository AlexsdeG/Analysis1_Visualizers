import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutShell } from './components/layout/LayoutShell';
import { Card } from './components/ui/Card';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('sequences');

  return (
    <LayoutShell>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto p-4">
        <Tabs.List className="flex border-b border-slate-200 mb-6" aria-label="Analysis Modules">
          <Tabs.Trigger
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 outline-none transition-colors cursor-pointer"
            value="sequences"
          >
            {t('modules.sequences.title')}
          </Tabs.Trigger>
          <Tabs.Trigger
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 outline-none transition-colors cursor-pointer"
            value="series"
          >
            {t('modules.series.title')}
          </Tabs.Trigger>
          <Tabs.Trigger
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 outline-none transition-colors cursor-pointer"
            value="functions"
          >
            {t('modules.functions.title')}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="sequences" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card title={t('modules.sequences.title')}>
            <div className="p-4 text-slate-600 text-center py-12">
              <p className="mb-2 text-lg font-semibold">{t('common.comingSoon')}</p>
              <p>{t('modules.sequences.description')}</p>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="series" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card title={t('modules.series.title')}>
            <div className="p-4 text-slate-600 text-center py-12">
              <p className="mb-2 text-lg font-semibold">{t('common.comingSoon')}</p>
              <p>{t('modules.series.description')}</p>
            </div>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="functions" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card title={t('modules.functions.title')}>
            <div className="p-4 text-slate-600 text-center py-12">
              <p className="mb-2 text-lg font-semibold">{t('common.comingSoon')}</p>
              <p>{t('modules.functions.description')}</p>
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </LayoutShell>
  );
};

export default App;