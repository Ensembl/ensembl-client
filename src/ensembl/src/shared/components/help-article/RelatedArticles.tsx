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
import { Link } from 'react-router-dom';

import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import { RelatedArticle as RelatedArticleType } from 'src/shared/components/help-popup/types';

import styles from './HelpArticle.scss';

type Props = {
  articles: RelatedArticleType[];
};

const RelatedArticles = (props: Props) => {
  const relatedArticles = props.articles.map((relatedArticle) => {
    const relatedItemClassName =
      relatedArticle.type === 'article'
        ? styles.relatedArticle
        : styles.relatedVideo;
    return (
      <Link
        to={relatedArticle.url}
        key={relatedArticle.slug}
        className={relatedItemClassName}
      >
        {relatedArticle.type === 'video' && (
          <span className={styles.relatedVideoIcon}>
            <VideoIcon />
          </span>
        )}
        {relatedArticle.title}
      </Link>
    );
  });

  return (
    <aside className={styles.aside}>
      <>
        <h2>More help...</h2>
        <div className={styles.relatedArticles}>{relatedArticles}</div>
      </>
    </aside>
  );
};

export default RelatedArticles;
