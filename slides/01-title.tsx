import React from 'react';
import type { SlideDef } from './types';

// A single indigo commit dot with a thin "main" tick: the deck's visual motif,
// lifted from the commit-graph language, used here as a quiet mark.
function CommitGlyph() {
  return (
    <svg width="40" height="56" viewBox="0 0 40 56" role="img" aria-label="A commit on main" className="mb-2">
      <line x1="20" y1="18" x2="20" y2="26" stroke="#A5A8FF" strokeWidth="1.25" />
      <text x="20" y="13" textAnchor="middle" fill="#A5A8FF" fontSize="13" fontFamily="Geist Mono, ui-monospace, monospace">
        main
      </text>
      <circle cx="20" cy="38" r="11" fill="#7376F7" />
    </svg>
  );
}

function Title() {
  return (
    <div className="flex flex-col gap-6">
      <CommitGlyph />
      <div className="flex flex-col gap-4">
        <div className="font-geist-mono text-xs uppercase tracking-wide text-interactive-bright">
          A visual crash course
        </div>
        <h1 className="text-balance">Git for non-engineers</h1>
        <p className="max-w-[34rem] text-xl text-gray-light max-md:text-lg">
          The tool engineers use to collaborate on code, explained for the designers who
          prototype alongside them.
        </p>
      </div>
      <div className="mt-6 font-geist-mono text-xs text-gray-medium">
        <span className="text-gray-dark">→</span> to begin
        <span className="mx-2 text-gray-dark">·</span>
        <span className="text-gray-dark">R</span> to replay a scene
      </div>
    </div>
  );
}

const slide: SlideDef = {
  id: 'title',
  title: 'Git for non-engineers',
  Component: Title,
  layout: 'title',
};

export default slide;
