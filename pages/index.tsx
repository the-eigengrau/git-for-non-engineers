import Head from 'next/head';
import dynamic from 'next/dynamic';
import { slides } from '../slides';

// The deck owns GSAP timelines and window listeners, so it renders client-side
// only. The dark canvas underneath means there is no flash before it mounts.
const Deck = dynamic(() => import('../components/deck/Deck'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Git for non-engineers</title>
        <meta
          name="description"
          content="A visual, jargon-light crash course on git, built as an interactive deck."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <main className="h-full w-full overflow-hidden bg-ultradark">
        <Deck slides={slides} />
      </main>
    </>
  );
}
