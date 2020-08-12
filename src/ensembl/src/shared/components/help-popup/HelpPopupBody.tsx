/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import styles from './HelpPopupBody.scss';

export type HelpVideo = {
  title: string;
  description: string;
  youtube_id: string;
};

type ArticleSummary = {
  title: string;
  slug: string;
  path: string;
};

export type HelpArticle = {
  path: string;
  slug: string;
  body: string;
  videos: HelpVideo[];
  related_articles: ArticleSummary[];
};

type LoadingArticle =
  | {
      loading: true;
      article: null;
    }
  | {
      loading: false;
      article: HelpArticle;
    };

type Props = LoadingArticle & {
  onArticleChange: (slug: string) => void;
  onVideoChange: (youtubeId: string) => void;
};

const HelpPopupBody = (props: Props) => {
  if (props.loading) {
    // TODO: Ideally, we will want to avoid showing the spinner if the article is loaded
    // nearly instantaneously. Perhaps revisit this when React gets Suspense.
    return (
      <div className={styles.spinnerContainer}>
        <CircleLoader />
      </div>
    );
  }

  // have to destructure article from props after checking for props.loading;
  // because only then typescript will be sure that article exists
  const { article } = props;

  /**
   * TODO: we do not know yet:
   * - how the interface will behave if there are multiple videos associated with a single article
   * - whether videos, in their turn, will also have related videos
   * - what should happen in the popup when a related video link is clicked
   * Therefore, the current implementation is provisional, and expected to be changed
   */

  const firstVideo = article.videos[0];
  const relatedVideos = article.videos.slice(1);

  const renderedVideo = firstVideo ? (
    <div className={styles.videoWrapper}>
      <iframe
        src={`https://www.youtube.com/embed/${firstVideo.youtube_id}`}
        allowFullScreen
        frameBorder="0"
      />
    </div>
  ) : null;

  const relatedArticles = article.related_articles.map((relatedArticle) => (
    <span
      key={relatedArticle.slug}
      className={styles.relatedArticle}
      onClick={() => props.onArticleChange(relatedArticle.slug)}
    >
      {relatedArticle.title}
    </span>
  ));

  const relatedVideoElements = relatedVideos.map((video) => (
    <span
      key={video.youtube_id}
      className={styles.relatedVideo}
      onClick={() => props.onVideoChange(video.youtube_id)}
    >
      <span className={styles.relatedVideoIcon}>
        <VideoIcon />
      </span>
      {video.title}
    </span>
  ));

  return (
    <div className={styles.grid}>
      <div className={styles.text}>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>
      <div className={styles.video}>{renderedVideo}</div>
      <div className={styles.aside}>
        {Boolean(relatedArticles.length) && (
          <>
            <h2>Related...</h2>
            <div className={styles.relatedArticlesContainer}>
              {relatedArticles}
              {relatedVideoElements}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HelpPopupBody;
