import Head from "next/head";

export default function Seo({ title }: any) {
  return (
    <Head>
      <title>{title} | Next Movies</title>
    </Head>
  );
}
