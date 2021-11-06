import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import readXml from "../util/readxml";

// Index page should show the list of all the available podcast episodes
// Each link will lead to the page about the episode

export default function Home(props) {
  return (
    <div>
      <Head>
        <title>{props.title}</title>
      </Head>
      <h1>Hello</h1>
      <p>{props.msg}</p>
      <p>XML Message: {props.xmlData}</p>
    </div>
  );
}

export async function getStaticProps(context) {
  const rss = "<root><msg>Hello, World! How are you today?</msg></root>";
  try {
    const data = await readXml(rss);
    return {
      props: {
        title: "This is the title of the homepage.",
        msg: "This is the message for you to see....",
        xmlData: data.root.msg[0],
      },
    };
  } catch (e) {
    console.log("Error: ", e);
  }
}
