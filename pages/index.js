import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import EpisodeList from "../components/EpisodeList";

import { useEffect, useState } from "react";

import readXml from "../util/readxml";
import { readFileSync } from "fs";

// Index page should show the list of all the available podcast episodes
// Each link will lead to the page about the episode

// TODO: Add pagination so that not all of the episodes are shown at once.

export default function Home({
  numEpisodes,
  episodeList,
  podcastTitle,
  podcastDescription,
}) {
  const [currentEpisodeList, setCurrentEpisodeList] = useState(episodeList);
  const [searchTerm, setSearchTerm] = useState("");

  // very simple text search for searching through the episode titles
  useEffect(() => {
    const eps = episodeList.filter((episode) =>
      episode.episodeTitle.includes(searchTerm)
    );
    setCurrentEpisodeList(eps);
  }, [searchTerm]);

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <Head>
        <title>Index Page</title>
      </Head>
      <h1>{podcastTitle}</h1>
      <p>{podcastDescription}</p>
      <p>Number of Episodes: {numEpisodes}</p>
      <input type="text" value={searchTerm} onChange={onSearchChange} />
      <EpisodeList episodeList={currentEpisodeList} />
    </div>
  );
}

export async function getStaticProps(context) {
  const feedFile = "./data/feed.rss";
  try {
    // open the rss file and parse it
    const rssData = readFileSync(feedFile, "utf-8");
    const data = await readXml(rssData);

    const podcastTitle = data.rss.channel[0].title[0];
    const podcastDescription = data.rss.channel[0].description[0];

    // get the list of podcasts
    // TODO: replace this with fetch to json-server
    const episodes = data.rss.channel[0].item;

    // create the array of episode objects
    const episodeList = episodes.map((episode) => {
      return {
        episodeTitle: episode.title[0],
        episodeDescription: episode.description[0],
        pubDate: episode.pubDate[0],
        link: episode.link[0],
      };
    });

    // pass the list of podcast episodes to the Home() component

    return {
      props: {
        numEpisodes: episodes.length,
        episodeList,
        podcastTitle,
        podcastDescription,
      },
    };
  } catch (e) {
    console.log("Error: ", e);
    return { props: { numEpisodes: -1 } };
  }
}
