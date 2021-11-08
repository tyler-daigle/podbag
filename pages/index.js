import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import EpisodeList from "../components/EpisodeList";

import { useEffect, useState } from "react";

import { podcastDbHost } from "../config";

// Index page should show the list of all the available podcast episodes
// Each link will lead to the page about the episode

// TODO: Add pagination so that not all of the episodes are shown at once.

// initial number of episodes to display when page is first loaded
const numEpisodesToFetch = 25;

export default function Home({
  numEpisodes,
  episodeList,
  podcastTitle,
  podcastDescription,
}) {
  const [currentEpisodeList, setCurrentEpisodeList] = useState(episodeList);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moreData, setMoreData] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // very simple text search for searching through the episode titles
  useEffect(async () => {
    let res;
    let eps;

    // TODO: debounce the request
    if (searchTerm === "") {
      // reset the episode list
      res = await fetch(
        `${podcastDbHost}/episodes?_limit=${currentPage * numEpisodesToFetch}`
      );
    } else {
      res = await fetch(`${podcastDbHost}/episodes?q=${searchTerm}`);
    }
    eps = await res.json();
    setCurrentEpisodeList(eps);
  }, [searchTerm]);

  useEffect(() => {
    if (currentEpisodeList.length >= numEpisodes) {
      setMoreData(false);
    }
  }, [currentEpisodeList]);
  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const loadMore = async () => {
    // fetch the next page of episodes and append it to the
    // previous currentEpisodeList

    setDataLoading(true);

    // TODO: remove fake loading delay
    setTimeout(async () => {
      const res = await fetch(
        `${podcastDbHost}/episodes?_page=${currentPage}&_limit=${numEpisodesToFetch}`
      );

      const moreEpisodes = await res.json();

      const eps = [...currentEpisodeList, ...moreEpisodes];
      setCurrentEpisodeList(eps);
      setCurrentPage(currentPage + 1);
      setDataLoading(false);
    }, 500);
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
      {dataLoading ? (
        <span>Loading...</span>
      ) : (
        <button type="button" onClick={loadMore}>
          {moreData ? "Load More" : "All Done"}
        </button>
      )}
    </div>
  );
}

async function getPodcastDetails() {
  try {
    const res = await fetch(`${podcastDbHost}/podcastDetails`);
    const { podcastTitle, podcastDescription, numEpisodes } = await res.json();

    return {
      podcastTitle,
      podcastDescription,
      numEpisodes,
    };
  } catch (e) {
    console.log(e);
  }
}

export async function getStaticProps(context) {
  try {
    // get the podcast details
    const { podcastTitle, podcastDescription, numEpisodes } =
      await getPodcastDetails();

    const host = podcastDbHost;

    const res = await fetch(`${host}/episodes?_limit=${numEpisodesToFetch}`);
    const episodes = await res.json();

    // create the array of episode objects
    const episodeList = episodes.map((episode) => {
      const { episodeTitle, episodeDescription, episodePubDate, episodeLink } =
        episode;
      return {
        episodeTitle,
        episodeDescription,
        episodePubDate,
        link: episodeLink,
        id: episode.id,
      };
    });

    // pass the list of podcast episodes to the Home() component

    return {
      props: {
        numEpisodes,
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
