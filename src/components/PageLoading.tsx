import React, { useEffect, useState } from 'react';
import type { Language } from '../types';

/**
 * Shown while a page is being fetched (pages load when first needed, see App.tsx).
 * It only appears after a short moment, so on a fast connection nothing flashes.
 */
export const PageLoading: React.FC<{ lang: Language }> = ({ lang }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 500);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className="flex-1 min-h-[50vh] flex items-center justify-center px-4" aria-busy="true">
      {visible && (
        <p role="status" className="text-xl font-bold text-[#17324D] dark:text-white">
          {lang === 'en' ? 'Loading the page…' : 'Die Seite wird geladen …'}
        </p>
      )}
    </div>
  );
};
