import React from 'react';
import type { SlideDef } from './types';
import { SlideHeading, PullQuote } from '../components/deck/SlideParts';

function LetTheAiDrive() {
  return (
    <div className="flex flex-col gap-10">
      <SlideHeading
        eyebrow="Let the AI drive"
        title="You describe the outcome"
        lead="Claude Code and Cursor run git for you. You say what you want in plain English and they translate, picking up your branch names and habits as they go."
      />
      <PullQuote>
        You do not need to learn git&rsquo;s syntax. You need to know what you want git
        to do.
      </PullQuote>
    </div>
  );
}

const slide: SlideDef = {
  id: 'let-the-ai-drive',
  title: 'Let the AI drive',
  Component: LetTheAiDrive,
  layout: 'content',
};

export default slide;
