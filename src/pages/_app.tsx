import Layout from "genre-quiz/pages/layout";
import { Provider } from "genre-quiz/store/provider";
import "genre-quiz/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
