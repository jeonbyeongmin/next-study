### NEXTJS -- NEXT  문서를 보며 느낀점.

<br/>

Next.js 는 프레임워크이다. 프레임워크는 라이브러리와 다르게 정해진 규칙같은 것이 있다. 개발자는 이 규칙을 반드시 지켜서 개발해야 한다. 이런 면에서 라이브러리는 프레임워크보다 자유도가 높지만, 많은 개발자가 투입되는 프로젝트의 경우 어차피 나름의 규칙을 정하곤 한다. 미리 정해진 규칙이 있다면 논의할 필요도 없이 그렇게 하면 된다. 이런 부분에서 시간을 절약해주어서 장점을 가진다고 생각한다. 하지만 정해진 규칙 내에서 커스텀이 가능하기 때문에 개선사항이 생겨도 프레임워크가 지원하지 않는다면 불가능하다. 이런 것은 단점으로 작용할 수 있을 것 같다.

<br/>

대표적으로 pages 디렉토리 안에 index.tsx, about.tsx 라는 파일을 만들어 export default 하면
라우터를 생성할 필요도 없이 '/', '/about' 이라는 페이지가 생성된다. 위의 기능도 멋지지만 next.js의 가장 좋은 점은 페이지를 미리 렌더링한다는 것이다. 이 말은 SSR, CSR과 같은 용어와 관련이 있다.
결론적으로 Next.js는 SSR처럼 동작한다.

<br/>

> Client Side Rendering
> CSR은 사용자가 어떤 사이트를 요청하면 빈 HTML만 다운받고 이 HTML을 파싱할 때 렌더링에 필요한 모든 JS를 다운받게 된다.
> JS가 다 다운되었을 때 이것을 실행하면 유저에게 보여진다. 다운받을 JS가 별로 없다면 상관 없지만, JS의 용량이 꽤 크다면
> 다운받을 시간동안 사용자에게 빈 화면만 보여줘야 하기 때문에 사용자 경험이 떨어진다.

<br/>

> Server Side Rendering
> SSR은 사용자가 어떤 사이트를 요청하면 미리 렌더링된 HTML을 받는다. 그 이후 자바스크립트를 로드해서 hydration 한다.
> Next는 기본적으로 모든 페이지를 HTML로 생성한다.

![static-generation](https://user-images.githubusercontent.com/28756358/154954693-019d80b8-a363-403f-8b86-da11a0b94a90.png)
![server-side-rendering](https://user-images.githubusercontent.com/28756358/154954684-1b2c4215-43e4-4fdc-83c2-b2c9d69d4746.png)


<br/>

Next.js는 위처럼 두가지 방식을 지원하는 것 같다. 하나는 정적 생성, 두번째는 SSR이다. 정적 생성은 빌드할 때 모든 페이지를 HTML로 만드는 것이고, SSR의 경우는 유저가 페이지를 요청했을 때 서버에서 HTML을 생성하여 주는 것을 말한다. 당연히 정적 생성만으로 가능한 페이지라면 그렇게 하는 것이 좋겠지만, 우리가 서비스할 페이지가 소위 말해 데이터 패칭이 필요한 페이지라면 빌드타임에 정적 페이지를 만드는 것은 적절치 않다. 그래서 정적 생성과 SSR을 합친 하이브리드 형태가 가장 이상적이라 볼 수 있다.

<br/>

#### 정적 생성

정적 생성은 개츠비와 너무 유사하다. 하긴 정적 생성이라 당연한거긴 하다.
공식 문서에서 데이터를 사용한 정적 생성은 Restful로 소개하고 있다.
개츠비에서는 그냥 Graphql을 사용하여 쿼리문을 작성하면 됐지만
Next에서는 getStaticProps 함수를 사용해야 하는 것 같다.

```javascript
export default function Home(props) { ... }

export async function getStaticProps() {
  // Get external data from the file system, API, DB, etc.
  const data = ...

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: ...
  }
}
```
<br/>

문서만 읽어보면 파일 시스템에 접근하는 부분이 조금 다른 것 같은데, 개츠비는 gatsby-node에서 미리 정해주는 반면에
넥스트는 lib이라는 곳에 파일 시스템에 접근하고 조작하는 로직을 짜주고, props를 사용하는 곳에서 이 함수를 사용하는 것 같다.

<br/>

```javascript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}
```

<br/>

```javascript
import { getSortedPostsData } from "../lib/posts";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
```

<br/>

gatStaticProps 는 파일 시스템 말고도 데이터베이스는 외부 API를 fetch하여 사용할 수도 있다고 한다.
(사용해보진 않았지만 gatsby에서도 그랬다.)
하지만 빌드 시간에 결정되는 것이라서 빌드 이후 클라이언트에서 getStaticProps가 실행되지는 않는다.
외부 API로 대량의 데이터를 가져와서 정적 페이지를 구축하는 것이라면 좋지만
역시 일반적이라면 정적페이지에 외부 API나 데이터베이스의 값을 사용할 것 같지는 않다...

<br/>

아무튼 API 요청을 자주 해줘야 하는 상황에서는 어울리지 않다. 이럴때 SSR을 사용한다. getServerSideProps를 사용한다.
getServerSideProps를 사용하지 않고 일바적인 방법으로 API 요청을 한다면 비동기 로직은 일반적인 리액트 앱처럼 CSR로 렌더링된다.

<br/>

```javascript
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}
```
<br/>

#### SWR -- React-query 같은거



next.js에도 리액트 쿼리같은 데이터 패칭 라이브러리?가 있다. vercel에서 만들었고
SSR을 제공하기 때문에 next.js랑 잘 쓰이는 것 같다. 아이디어나 사용법은 react-query랑 비슷해보인다.
언제 한번 비교해보는 블로그 포스트를 작성하면 좋을 것 같다.

<br/>
<br/>
