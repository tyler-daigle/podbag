/*
  {
    "podcastDetails" : {
      "podcastTitle" : "Title",
      "podcastLink" : "",
      "podcastDescription" : "asdfasdf",
      "podcastCategory" : "asdfasf, asdfasdf",
      "podcastImage" : {
        "fileName" : "uuid-asdf-asd.jpg",
        "imageLink" : "https://asdfasdf"
      },
      "numEpisodes" : 123
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

const readXml = require("./readxml");
const fs = require("fs");
const { v4: uuid } = require("uuid");

async function rssToJson(rssFile) {
  try {
    const xmlData = fs.readFileSync(rssFile, "utf-8");
    const rss = await readXml(xmlData);
    const podcastData = rss.rss.channel[0];
    const podcastEpisodes = rss.rss.channel[0].item;
    const podcastDetails = {};

    // const imageList = []; // list of images that will have to be downloaded

    // data about the podcast
    podcastDetails.podcastTitle = podcastData.title[0];
    podcastDetails.podcastLink = podcastData.link[0];
    podcastDetails.podcastDescription = podcastData.description[0];
    podcastDetails.podcastCategory = podcastData.category[0];

    const podcastImageLink = podcastData.image[0].url[0];

    // create a filename for the image that will be used when the file is downloaded and saved
    // save the actual link to the image so it can be downloaded later

    podcastDetails.podcastImage = {
      fileName: `${uuid()}.${podcastImageLink.substring(
        podcastImageLink.length - 3
      )}`,
      imageLink: podcastImageLink,
    };

    podcastDetails.numEpisodes = podcastEpisodes.length;

    // get all the episodes now

    const episodes = [];

    podcastEpisodes.forEach((episode, index) => {
      const episodeData = {};
      episodeData.id = index;
      episodeData.episodeTitle = episode.title[0];
      episodeData.episodeLink = episode.link[0];
      episodeData.episodePubDate = episode.pubDate[0];
      episodeData.episodeDescription = episode.description[0];
      episodeData.episodeDuration = episode["itunes:duration"][0];

      const episodeImageLink = episode["itunes:image"][0].$.href;

      const episodeImage = {
        imageLink: episodeImageLink,
        fileName: `${uuid()}.${episodeImageLink.substring(
          episodeImageLink.length - 3
        )}`,
      };
      episodeData.episodeImage = episodeImage;
      episodes.push(episodeData);
    });

    console.log(JSON.stringify({ podcastDetails, episodes }));
    console.log(podcastEpisodes.length);
  } catch (e) {
    console.log(e);
  }
}

if (process.argv.length !== 3) {
  console.log("Usage: rss_to_json <file.rss>");
  return -1;
}
const filename = process.argv[2];
// const filename = "../data/purplestuff.rss";

rssToJson(filename);
