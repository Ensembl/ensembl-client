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

import useHelpArticle, {
  emptyRelatedItems,
  CurrentArticle,
  CurrentVideo,
  CurrentItem,
  RelatedItems as RelatedItemsType,
  ArticleReference,
  VideoReference
} from './useHelpArticle';
import useResizeObserver from 'src/shared/hooks/useResizeObserver.ts';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';

import {
  RelatedArticle,
  HelpVideo,
  SlugReference,
  PathReference
} from './types';

import styles from './HelpPopupBody.scss';

type Props = SlugReference | PathReference;

const HelpPopupBody = (props: Props) => {
  const [currentReference, setCurrentReference] = useState<
    ArticleReference | VideoReference
  >(createArticleReference(props));
  const { currentHelpItem, relatedHelpItems } = useHelpArticle(
    currentReference
  );

  const onRelatedItemClick = (reference: ArticleReference | VideoReference) => {
    setCurrentReference(reference);
  };

  if (currentHelpItem?.type === 'article') {
    return (
      <Grid type="article">
        <Article article={currentHelpItem} />
        <RelatedItems
          currentItem={currentHelpItem}
          items={relatedHelpItems || emptyRelatedItems}
          onItemClick={onRelatedItemClick}
        />
      </Grid>
    );
  } else if (currentHelpItem?.type === 'video') {
    return (
      <Grid type="video">
        <Video video={currentHelpItem} />
        <RelatedItems
          currentItem={currentHelpItem}
          items={relatedHelpItems || emptyRelatedItems}
          onItemClick={onRelatedItemClick}
        />
      </Grid>
    );
  } else {
    return (
      <div className={styles.spinnerContainer}>
        <CircleLoader />
      </div>
    );
  }
};

type GridProps = {
  type: CurrentItem['type'];
  children: ReactNode;
};

const Grid = (props: GridProps) => {
  const gridClass = classNames(styles.grid, styles[`grid_${props.type}`]);

  return <div className={gridClass}>{props.children}</div>;
};

type ArticleProps = {
  article: CurrentArticle;
};
const Article = (props: ArticleProps) => {
  return (
    <article className={styles.article}>
      <div dangerouslySetInnerHTML={{ __html: props.article.body }} />
    </article>
  );
};

type VideoProps = {
  video: CurrentVideo;
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
  items: RelatedItemsType;
  currentItem: CurrentItem;
  onItemClick: (reference: ArticleReference | VideoReference) => void;
};
const RelatedItems = (props: RelatedItemsProps) => {
  const onArticleClick = (article: RelatedArticle) => {
    props.onItemClick(createArticleReference({ path: article.path }));
  };

  const onVideoClick = (video: HelpVideo) => {
    props.onItemClick(createVideoReference(video.youtube_id));
  };

  const relatedArticles = props.items.articles.map((relatedArticle) => {
    const elementClasses = classNames(styles.relatedArticle, {
      [styles.relatedCurrent]:
        props.currentItem.type === 'article' &&
        props.currentItem.path === relatedArticle.path
    });
    return (
      <span
        key={relatedArticle.slug}
        className={elementClasses}
        onClick={() => onArticleClick(relatedArticle)}
      >
        {relatedArticle.title}
      </span>
    );
  });

  const relatedVideoElements = props.items.videos.map((video) => {
    const elementClasses = classNames(styles.relatedVideo, {
      [styles.relatedCurrent]:
        props.currentItem.type === 'video' &&
        props.currentItem.youtube_id === video.youtube_id
    });

    return (
      <span
        key={video.youtube_id}
        className={elementClasses}
        onClick={() => onVideoClick(video)}
      >
        <span className={styles.relatedVideoIcon}>
          <VideoIcon />
        </span>
        {video.title}
      </span>
    );
  });

  return (
    <aside className={styles.aside}>
      <>
        <h2>Help with...</h2>
        <div className={styles.relatedArticlesContainer}>
          {relatedArticles}
          {relatedVideoElements}
        </div>
      </>
    </aside>
  );
};

const createArticleReference = (reference: SlugReference | PathReference) => {
  return {
    type: 'article' as const,
    reference
  };
};

const createVideoReference = (youtubeId: string) => {
  return {
    type: 'video' as const,
    youtube_id: youtubeId
  };
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
