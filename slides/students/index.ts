import type { SlideDef } from '../types';
import aditi from './aditi';
import amartya from './amartya';
import arthur from './arthur';
import ayon from './ayon';
import celia from './celia';
import hamza from './hamza';
import jon from './jon';
import kusum from './kusum';
import lee from './lee';
import lucy from './lucy';
import neeraj from './neeraj';
import niloo from './niloo';
import peter from './peter';
import raj from './raj';
import sara from './sara';
import suresh from './suresh';
import vinay from './vinay';

// Every student's slide, kept in alphabetical order automatically. Adding a new
// person is one file in this folder plus one import line above; the sort keeps
// the deck tidy no matter where you add it.
export const studentSlides: SlideDef[] = [
  aditi,
  amartya,
  arthur,
  ayon,
  celia,
  hamza,
  jon,
  kusum,
  lee,
  lucy,
  neeraj,
  niloo,
  peter,
  raj,
  sara,
  suresh,
  vinay,
].sort((a, b) => a.title.localeCompare(b.title));
