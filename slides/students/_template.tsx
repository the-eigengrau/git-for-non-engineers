import React from 'react';
import type { SlideDef } from '../types';

// One student, one slide. Each student owns a file in this folder and edits the
// fields below: their name, their role, a line about themselves, and an avatar
// (any emoji; it falls back to their initial). Those edits are the workshop:
// branch, change your bio, open a pull request, and resolve the conflict when
// main has moved on.
export type StudentDef = {
  name: string;
  role?: string;
  bio: string;
  /** An emoji, e.g. '🦊'. Falls back to the first letter of the name. */
  avatar?: string;
};

const slugify = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function makeStudentSlide(student: StudentDef): SlideDef {
  const mark = (student.avatar && student.avatar.trim()) || student.name.trim().charAt(0).toUpperCase();

  function StudentSlide() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-interactive/40 bg-gray-very-dark text-2xl leading-none text-ultralight">
          {mark}
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-geist-mono text-xs uppercase tracking-wide text-interactive-bright">
            The class
          </div>
          <h2>{student.name}</h2>
          {student.role && <p className="text-lg text-gray-medium">{student.role}</p>}
          <p className="max-w-[42rem] text-lg text-gray-light">{student.bio}</p>
        </div>
      </div>
    );
  }

  return {
    id: `student-${slugify(student.name)}`,
    title: student.name,
    Component: StudentSlide,
    layout: 'closing',
  };
}
