import { useState } from "react";
import styles from "../styles/EpisodeList.module.css";

function EpisodeDetails({
  episodeId,
  episodeTitle,
  episodeDescription,
  pubDate,
  link,
}) {
  const [descVisible, setDescVisible] = useState(false);
  return (
    <li
      key={episodeId}
      className={styles.episodeList}
      onClick={() => setDescVisible(!descVisible)}
    >
      <span className="episodeTitle">{episodeTitle}</span>
      {descVisible && (
        <div>
          <p>Published on {pubDate}</p>
          <p>{episodeDescription}</p>
          <a href={link}>Show Link</a>
        </div>
      )}
    </li>
  );
}

export default function EpisodeList({ episodeList, start = 0, len }) {
  return (
    <ol>
      {episodeList
        .slice(start, len)
        .map(
          ({
            id,
            episodeTitle,
            episodeDescription,
            episodePubDate,
            episodeLink,
          }) => (
            <EpisodeDetails
              episodeId={id}
              episodeTitle={episodeTitle}
              episodeDescription={episodeDescription}
              pubDate={episodePubDate}
              link={episodeLink}
            />
          )
        )}
    </ol>
  );
}
