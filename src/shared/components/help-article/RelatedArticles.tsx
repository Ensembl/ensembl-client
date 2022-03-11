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
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import VideoIcon from 'static/icons/icon_video.svg';

import { RelatedArticleData } from 'src/shared/types/help-and-docs/article';

import styles from './HelpArticle.scss';

type Props = {
  articles: RelatedArticleData[];
  title?: string;
  highlightActiveArticle?: boolean;
  onArticleClick?: (article: RelatedArticleData) => void;
};

const RelatedArticles = (props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onArticleClick = (article: RelatedArticleData) => {
    if (props.onArticleClick) {
      props.onArticleClick(article);
    } else {
      navigate(article.url);
    }
  };

  const relatedArticles = props.articles.map((relatedArticle) => {
    const relatedItemClassName = classNames({
      [styles.relatedArticle]: relatedArticle.type === 'article',
      [styles.relatedVideo]: relatedArticle.type === 'video',
      [styles.relatedArticleActive]:
        props.highlightActiveArticle && relatedArticle.url === location.pathname
    });

    return (
      <a
        href={relatedArticle.url}
        key={relatedArticle.slug}
        className={relatedItemClassName}
        onClick={(event) => {
          event.preventDefault();
          onArticleClick(relatedArticle);
        }}
      >
        {relatedArticle.type === 'video' && (
          <span className={styles.relatedVideoIcon}>
            <VideoIcon />
          </span>
        )}
        {relatedArticle.title}
      </a>
    );
  });

  const title = props.title || 'More help...';

  return (
    <aside className={styles.aside}>
      <>
        <h2>{title}</h2>
        <div className={styles.relatedArticles}>{relatedArticles}</div>
      </>
    </aside>
  );
};

export default RelatedArticles;
