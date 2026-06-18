import React, { useEffect, useState } from 'react';
import { Folder, Layers, GitCommit, Github, type LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { useScenePlayback } from './playback';

type Zone = { key: string; label: string; desc: string; Icon: LucideIcon };

// Plain-English, jargon-free descriptions (6-8 words) revealed on tap.
const ZONES: Zone[] = [
  { key: 'folder', label: 'Your folder', desc: "The files you're actually editing right now.", Icon: Folder },
  { key: 'staging', label: 'Staging', desc: "Changes you've marked to save next.", Icon: Layers },
  { key: 'repo', label: 'Repository', desc: "Your project's full history, on your computer.", Icon: GitCommit },
  { key: 'remote', label: 'GitHub', desc: 'The shared copy online that everyone uses.', Icon: Github },
];

// Short labels keep the row inside the reading column.
const FORWARD = ['add', 'commit', 'push'];

// A picture of where your work lives. A highlight starts on "Your folder" and
// travels card to card as add → commit → push fire, ending on GitHub. Tap any
// card for a plain-English description in place.
export default function CommandMap() {
  const { shouldPlay, playToken, reducedMotion } = useScenePlayback();
  // flowIndex: which card the travelling highlight is on (starts on the folder).
  const [flowIndex, setFlowIndex] = useState(0);
  const [litCmds, setLitCmds] = useState<boolean[]>([false, false, false]);
  const [litPull, setLitPull] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setFlowIndex(ZONES.length - 1);
      setLitCmds([true, true, true]);
      setLitPull(true);
      return;
    }
    if (typeof window === 'undefined') return;

    setFlowIndex(0);
    setLitCmds([false, false, false]);
    setLitPull(false);
    if (!shouldPlay) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to({}, { duration: 0.6 });
      FORWARD.forEach((_, i) => {
        tl.call(() => setLitCmds((prev) => prev.map((v, j) => (j === i ? true : v))));
        tl.call(() => setFlowIndex(i + 1));
        tl.to({}, { duration: 0.75 });
      });
      tl.call(() => setLitPull(true));
    });

    return () => ctx.revert();
  }, [shouldPlay, playToken, reducedMotion]);

  return (
    <div className="relative">
      <div className="flex flex-col items-stretch gap-0 md:flex-row md:items-stretch">
        {ZONES.map((z, i) => {
          const tapped = active === z.key;
          const lit = tapped || (active === null && flowIndex === i);
          return (
            <React.Fragment key={z.key}>
              <button
                type="button"
                onClick={() => setActive((a) => (a === z.key ? null : z.key))}
                aria-pressed={tapped}
                aria-label={`${z.label}: ${z.desc}`}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-[var(--radius-card-sm)] border bg-transparent px-4 py-4 text-center transition-all duration-500 md:min-h-[6rem] md:flex-col md:gap-2 md:py-5 ${
                  lit
                    ? 'scale-[1.03] border-interactive'
                    : 'border-gray-very-dark hover:border-gray-medium'
                }`}
              >
                {tapped ? (
                  <span className="text-sm leading-snug text-ultralight">{z.desc}</span>
                ) : (
                  <>
                    <z.Icon
                      className={`h-5 w-5 shrink-0 transition-colors duration-500 ${lit ? 'text-interactive-bright' : 'text-gray-medium'}`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-500 ${lit ? 'text-ultralight' : 'text-gray-light'}`}
                    >
                      {z.label}
                    </span>
                  </>
                )}
              </button>

              {i < ZONES.length - 1 && (
                <div className="flex items-center justify-center py-2 md:w-14 md:py-0">
                  <span className={`git-cmd text-xs ${litCmds[i] ? 'cmd-on' : ''}`}>{FORWARD[i]}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* return label */}
      <div className="mt-5 flex justify-center">
        <span className={`git-cmd text-xs ${litPull ? 'cmd-on' : ''}`}>
          pull · brings everyone else&rsquo;s work back in
        </span>
      </div>
    </div>
  );
}
