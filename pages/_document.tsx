import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    // Inline dark background on <html> paints on the first frame (before
    // external CSS loads) to prevent a white flash on refresh.
    return (
      <Html lang="en" style={{ backgroundColor: '#0D0C0C' }}>
        <Head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
          <link
            href="https://cdn.jsdelivr.net/npm/@vercel/font@1.0.0/geist-mono.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
