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

import React, { useState, useEffect, useRef } from 'react';

import useResizeObserver from 'src/shared/hooks/useResizeObserver';

import { CircleLoader } from 'src/shared/components/loader';

import { LoadingState } from 'src/shared/types/loading-state';
import { VideoArticleData } from 'src/shared/types/help-and-docs/article';

import styles from './HelpArticle.scss';

type Props = {
  video: VideoArticleData;
};

const VideoArticle = (props: Props) => {
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
    <div ref={containerRef} className={styles.videoArticle}>
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

export default VideoArticle;
