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

import React, { useState, useRef, ReactNode } from 'react';
import classNames from 'classnames';

import useHelpArticle, { Article as ArticleType } from './useHelpArticle';
import useResizeObserver from 'src/shared/hooks/useResizeObserver.ts';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import { LoadingState } from 'src/shared/types/loading-state';
import {
  RelatedArticle,
  TextArticle,
  VideoArticle,
  SlugReference
} from './types';

import styles from './HelpPopupBody.scss';

type Props = SlugReference;

const HelpPopupBody = (props: Props) => {
  const [currentReference, setCurrentReference] = useState<SlugReference>(
    props
  );
  const { article, loadingState } = useHelpArticle(currentReference);

  const onRelatedItemClick = (reference: SlugReference) => {
    setCurrentReference(reference);
  };

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className={styles.spinnerContainer}>
        <CircleLoader />
      </div>
    );
  }

  if (article) {
    return (
      <Grid type={article.type}>
        {article.type === 'article' ? (
          <Article article={article} />
        ) : (
          <Video video={article} />
        )}
        {article.related_articles.length > 0 && (
          <RelatedItems
            items={article.related_articles}
            onItemClick={onRelatedItemClick}
          />
        )}
      </Grid>
    );
  } else {
    return null;
  }
};

type GridProps = {
  type: ArticleType['type'];
  children: ReactNode;
};

const Grid = (props: GridProps) => {
  const gridClass = classNames(styles.grid, styles[`grid_${props.type}`]);

  return <div className={gridClass}>{props.children}</div>;
};

type ArticleProps = {
  article: TextArticle;
};
const Article = (props: ArticleProps) => {
  return (
    <article className={styles.article}>
      <div dangerouslySetInnerHTML={{ __html: props.article.body }} />
    </article>
  );
};

type VideoProps = {
  video: VideoArticle;
};
const Video = (props: VideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useResizeObserver({
    ref: containerRef
  });

  // ensure that the video has a 16:9 aspect ratio
  // TODO: switch to pure CSS when the aspect-ratio rule gets better support (see https://caniuse.com/?search=aspect-ratio)
  const { width: videoWidth, height: videoHeight } = calculateVideoDimensions(
    containerWidth,
    containerHeight
  );

  const videoStyle = {
    width: `${videoWidth}px`,
    height: `${videoHeight}px`
  };

  return (
    <div ref={containerRef} className={styles.video}>
      {videoWidth && videoHeight && (
        <div className={styles.videoWrapper}>
          <iframe
            style={videoStyle}
            src={`https://www.youtube.com/embed/${props.video.youtube_id}`}
            allowFullScreen
            frameBorder="0"
          />
        </div>
      )}
    </div>
  );
};

type RelatedItemsProps = {
  items: ArticleType['related_articles'];
  onItemClick: (reference: SlugReference) => void;
};
const RelatedItems = (props: RelatedItemsProps) => {
  const onArticleClick = (article: RelatedArticle) => {
    props.onItemClick({ slug: article.slug });
  };

  const relatedArticles = props.items.map((relatedArticle) => {
    return (
      <span
        key={relatedArticle.slug}
        className={styles.relatedArticle}
        onClick={() => onArticleClick(relatedArticle)}
      >
        {relatedArticle.type === 'video' && (
          <span className={styles.relatedVideoIcon}>
            <VideoIcon />
          </span>
        )}
        {relatedArticle.title}
      </span>
    );
  });

  return (
    <aside className={styles.aside}>
      <>
        <h2>More help...</h2>
        <div className={styles.relatedArticlesContainer}>{relatedArticles}</div>
      </>
    </aside>
  );
};

const calculateVideoDimensions = (
  containerWidth: number,
  containerHeight: number
) => {
  if (!containerWidth || !containerHeight) {
    return {
      width: 0,
      height: 0
    };
  }

  const referenceSide =
    containerWidth / containerHeight <= 16 / 9 ? 'width' : 'height';
  if (referenceSide === 'width') {
    return {
      width: containerWidth,
      height: Math.round((containerWidth * 9) / 16)
    };
  } else {
    return {
      width: Math.round((containerHeight * 16) / 9),
      height: containerHeight
    };
  }
};

export default HelpPopupBody;
