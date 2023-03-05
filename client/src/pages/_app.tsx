import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import NextProgress from 'next-progress';
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress />
      <Component {...pageProps} />;
    </>
  );
}
