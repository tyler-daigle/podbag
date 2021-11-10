import styles from "../styles/EpisodeList.module.css";

function EpisodeDetails({
  episodeId,
  episodeTitle,
  episodeDescription,
  pubDate,
  link,
}) {
  // truncate the description if needed
  const maxDescLength = 450;
  if (episodeDescription.length > maxDescLength) {
    episodeDescription = episodeDescription.substring(0, maxDescLength);
    episodeDescription += "...";
  }

  return (
    <li key={episodeId} className={styles.episodeListItem}>
      <div className={styles.placeHolderImage}></div>
      <div className={styles.episodeDetails}>
        <a href={link} className={styles.showLink}>
          {episodeTitle}
        </a>
        <p>{episodeDescription}</p>
        <p className={styles.publishedDate}>{pubDate}</p>
      </div>
    </li>
  );
}

export default function EpisodeList({ episodeList, start = 0, len }) {
  return (
    <div className={styles.episodeListContainer}>
      <ol className={styles.episodeList}>
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
    </div>
  );
}
