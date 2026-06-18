import React from 'react';
import type { SlideDef } from '../../slides/types';

type SlideLayoutProps = {
  slide: SlideDef;
  children: React.ReactNode;
};

// The frame every slide sits in: a full-stage surface that centres a single
// content column, with the quiet caption beneath it. Layout variants only
// adjust the column width and rhythm, never the visual language.
export default function SlideLayout({ slide, children }: SlideLayoutProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-[8vw] py-[14vh] max-md:px-[7vw]">
      {/* One column width across every slide keeps a steady left edge as you move. */}
      <div className="flex w-full max-w-[52rem] flex-col">
        {children}
        {slide.caption && <p className="deck-caption mt-5">{slide.caption}</p>}
      </div>
    </div>
  );
}
