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

import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import classNames from 'classnames';

import HelpPopupHistory from './helpPopupHistory';

import useHelpArticle from './useHelpArticle';

import {
  HelpArticleGrid,
  TextArticle,
  VideoArticle,
  RelatedArticles
} from 'src/shared/components/help-article';
import { CircleLoader } from 'src/shared/components/loader/Loader';

import { ReactComponent as BackIcon } from 'static/img/browser/navigate-left.svg';
import { ReactComponent as ForwardIcon } from 'static/img/browser/navigate-right.svg';

import { LoadingState } from 'src/shared/types/loading-state';
import { SlugReference } from './types';

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
        <HelpArticleGrid>
          {article.type === 'article' ? (
            <TextArticle article={article} className={styles.article} />
          ) : (
            <VideoArticle video={article} />
          )}
          {article.related_articles.length > 0 && (
            <RelatedArticles
              articles={article.related_articles}
              onArticleClick={onRelatedItemClick}
            />
          )}
        </HelpArticleGrid>
        {historyButtons}
      </>
    );
  } else {
    return null;
  }
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

export default HelpPopupBody;
