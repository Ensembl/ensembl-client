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

import styles from './HelpPopupBody.scss';

export type HelpVideo = {
  title: string;
  description: string;
  url: string;
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

type Props = {
  article: HelpArticle;
  onArticleChange: (slug: string) => void;
};

const HelpPopupBody = (props: Props) => {
  const { article } = props;

  const videos = article.videos.map((video) => (
    <div className={styles.videoWrapper} key={video.url}>
      <iframe src={video.url} allowFullScreen frameBorder="0" />
    </div>
  ));

  const relatedArticles = article.related_articles.map((relatedArticle) => (
    <span
      key={relatedArticle.slug}
      className={styles.relatedArticle}
      onClick={() => props.onArticleChange(relatedArticle.slug)}
    >
      {relatedArticle.title}
    </span>
  ));

  return (
    <div className={styles.grid}>
      <div className={styles.text}>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </div>
      <div className={styles.video}>{videos}</div>
      <div className={styles.aside}>
        {Boolean(relatedArticles.length) && (
          <>
            <h2>Related...</h2>
            <div className={styles.relatedArticlesContainer}>
              {relatedArticles}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HelpPopupBody;
