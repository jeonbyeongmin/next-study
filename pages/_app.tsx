import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
