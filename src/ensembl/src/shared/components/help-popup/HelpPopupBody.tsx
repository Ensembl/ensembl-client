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

import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  MutableRefObject
} from 'react';
import classNames from 'classnames';

import HelpPopupHistory from './helpPopupHistory';

import useHelpArticle, { Article as ArticleType } from './useHelpArticle';
import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { ReactComponent as VideoIcon } from 'static/img/shared/video.svg';
import { ReactComponent as BackIcon } from 'static/img/browser/navigate-left.svg';
import { ReactComponent as ForwardIcon } from 'static/img/browser/navigate-right.svg';

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
  const historyRef = useRef<HelpPopupHistory | null>(null);

  useEffect(() => {
    historyRef.current = new HelpPopupHistory(currentReference);
  }, []);

  const onRelatedItemClick = (reference: SlugReference) => {
    historyRef.current?.add(reference);
    setCurrentReference(reference);
  };

  const onHistoryBack = () => {
    const prevReference = historyRef.current?.getPrevious();
    if (prevReference) {
      setCurrentReference(prevReference);
    }
  };

  const onHistoryForward = () => {
    const nextReference = historyRef.current?.getNext();
    if (nextReference) {
      setCurrentReference(nextReference);
    }
  };

  const historyButtons = (
    <HistoryButtons
      historyRef={historyRef}
      onHistoryBack={onHistoryBack}
      onHistoryForward={onHistoryForward}
    />
  );

  if (loadingState === LoadingState.LOADING) {
    return (
      <>
        <div className={styles.spinnerContainer}>
          <CircleLoader />
        </div>
        {historyButtons}
      </>
    );
  }

  if (article) {
    return (
      <>
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
        {historyButtons}
      </>
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

type HistoryButtonsProps = {
  historyRef: MutableRefObject<HelpPopupHistory | null>;
  onHistoryBack: () => void;
  onHistoryForward: () => void;
};
const HistoryButtons = (props: HistoryButtonsProps) => {
  const { historyRef, onHistoryBack, onHistoryForward } = props;
  const historyForwardClasses = classNames(
    styles.historyButton,
    historyRef.current?.hasNext()
      ? styles.historyButtonActive
      : styles.historyButtonInactive
  );
  const historyBackClasses = classNames(
    styles.historyButton,
    historyRef.current?.hasPrevious()
      ? styles.historyButtonActive
      : styles.historyButtonInactive
  );

  return (
    <div className={styles.historyButtons}>
      <BackIcon className={historyBackClasses} onClick={onHistoryBack} />
      <ForwardIcon
        className={historyForwardClasses}
        onClick={onHistoryForward}
      />
    </div>
  );
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
  const [videoLoadingStatus, setVideoLoadingStatus] = useState(
    LoadingState.LOADING
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useResizeObserver({
    ref: containerRef
  });

  useEffect(() => {
    setVideoLoadingStatus(LoadingState.LOADING);
  }, [props.video.youtube_id]);

  const onVideoLoaded = () => {
    setVideoLoadingStatus(LoadingState.SUCCESS);
  };

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
          {videoLoadingStatus === LoadingState.LOADING && (
            <div className={styles.videoLoadingIndicator} style={videoStyle}>
              <CircleLoader />
            </div>
          )}
          <iframe
            style={videoStyle}
            onLoad={onVideoLoaded}
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
    const relatedItemClassName =
      relatedArticle.type === 'article'
        ? styles.relatedArticle
        : styles.relatedVideo;
    return (
      <span
        key={relatedArticle.slug}
        className={relatedItemClassName}
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
