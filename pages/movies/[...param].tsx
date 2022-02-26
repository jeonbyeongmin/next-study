import Seo from "../../components/SEO";

export default function Detail({ param }: any) {
  const [title, id] = param || [];

  return (
    <div>
      <Seo title={title} />
      <h4>{title}</h4>
    </div>
  );
}

export function getServerSideProps({ params }: any) {
  return {
    props: {
      param: params.param,
    },
  };
}
