import NavBar from "../components/NavBar";

/* 
Custom App이라고 생각하면 될듯
Layout 같은! global하게 앱 전체에 적용해주고 싶은 스타일이나 컴포넌트를 정해줄수 잇음
*/

export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
}
