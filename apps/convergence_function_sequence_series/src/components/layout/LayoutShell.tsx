import React, { PropsWithChildren } from 'react';
import { Navbar } from './Navbar';

export const LayoutShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Analysis 1 Interactive. MIT License.</p>
        </div>
      </footer>
    </div>
  );
};