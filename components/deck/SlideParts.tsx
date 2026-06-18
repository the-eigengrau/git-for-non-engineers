import React, { type ReactNode } from 'react';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

// A quiet mono label that sits above a slide title, like a section marker.
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="font-geist-mono text-xs uppercase tracking-wide text-interactive-bright">
      {children}
    </div>
  );
}

// The standard heading block: eyebrow, title, one-line lead. Left-aligned so the
// deck keeps a strong, consistent left edge from slide to slide.
export function SlideHeading({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance">{title}</h2>
      {lead && <p className="max-w-[42rem] text-lg text-gray-light">{lead}</p>}
    </div>
  );
}

// A single idea, compressed to one memorable line. One indigo edge, nothing else.
export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-interactive pl-5 text-2xl font-medium leading-snug text-ultralight max-md:text-xl">
      {children}
    </blockquote>
  );
}

// A spare ordered list for steps and habits: a quiet mono index, then the line.
export function StepList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-baseline gap-4">
          <span className="font-geist-mono text-sm text-interactive-bright">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-lg text-gray-light max-md:text-base">{item}</span>
        </li>
      ))}
    </ol>
  );
}

// The bordered surface an animation sits on. A touch lighter than the page so it
// reads as a raised canvas, matching the blog's figure treatment.
export function SlideCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'flex w-full items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-gray-very-dark bg-gray-very-dark/30 px-6 py-10 max-md:px-4 max-md:py-7',
        className,
      )}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}
