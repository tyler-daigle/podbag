/*
  {
    "podcastTitle" : "Title",
    "podcastLink" : "",
    "podcastDescription" : "asdfasdf",
    "podcastCategory" : "asdfasf, asdfasdf",
    "podcastImage" : {
      "fileName" : "uuid-asdf-asd.jpg",
      "imageLink" : "https://asdfasdf"
    },
    "episodes" : [
      {
        "episodeTitle" : "title",
        "episodeLink" : "http://asf",
        "episodePubDate" : "the date",
        "episodeDescription": The description",
        "episodeDuration" : "51:34",
        "episodeImage" : {
          "fileName" : "uuid-asdf-asd.jpg",
          "imageLink" : "https://asdfasdf"
        },
      }
    ]
  }
*/

import readXml from "./readxml";
import fs from "fs";
import { v4 as uuid } from "uuid";

async function rssToJson(rssFile) {
  try {
    const xmlData = fs.readFileSync(rssFile, "utf-8");
    const rss = await readXml(xmlData);
    const podcastData = rss.rss.channel[0];
    const podcastEpisodes = rss.rss.channel[0].item;
    const podcast = {};

    const imageList = [];

    podcast.podcastTitle = podcastData.title[0];
    podcast.podcastLink = podcastData.link[0];
    podcast.podcastDescription = podcastData.description[0];
    podcast.podcastCategory = podcastData.category[0];

    const podcastImageLink = podcastData.image[0].url[0];

    podcast.podcastImage = {
      fileName: `${uuid()}.${podcastImageLink.subString(
        podcastImageLink.length - 3
      )}`,
      imageLink: podcastImageLink,
    };

    podcast.episodeCount = podcastEpisodes.length;

    console.log(JSON.stringify(podcast));
  } catch (e) {
    console.log(e);
  }
}

const fileName = "../data/purplestuff.rss";

rssToJson(fileName);
