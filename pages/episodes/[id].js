export default function Episode({ episodeData }) {
  return (
    <div>
      <h1>{episodeData.episodeTitle}</h1>
      <p>{episodeData.episodeDescription}</p>
      <span>{episodeData.episodePubDate}</span>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = [];

  for (let i = 0; i < 20; i++) {
    paths.push({ params: { id: `${i}` } });
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const server = "http://localhost:9000/episodes";

  const data = await fetch(`${server}/${params.id}`);
  const episodeData = await data.json();

  return {
    props: {
      episodeData,
    },
  };
}
