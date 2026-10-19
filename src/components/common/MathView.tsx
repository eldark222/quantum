import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  ariaLabel,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block font-serif text-slate-100 ${block ? 'my-2 block text-center overflow-x-auto py-1' : ''} ${className}`}
      aria-label={ariaLabel || math}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
