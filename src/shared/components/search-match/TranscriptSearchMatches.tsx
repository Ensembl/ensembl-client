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

import { useState } from 'react';
import classNames from 'classnames';

import { useAppDispatch } from 'src/store';
import { changeHighlightedTrackId } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import * as urlFor from 'src/shared/helpers/urlHelper';

import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import TextButton from 'src/shared/components/text-button/TextButton';
import { ViewInApp } from 'src/shared/components/view-in-app/ViewInApp';

import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { TranscriptSearchMatch as TranscriptSearchMatchType } from 'src/shared/types/search-api/search-match';
import type {
  FeatureSearchAppName,
  FeatureSearchMatchPosition
} from 'src/shared/helpers/featureSearchHelpers';

import styles from './SearchMatch.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

type TranscriptSearchMatchesProps = {
  app: FeatureSearchAppName;
  mode: FeatureSearchMatchPosition;
  results: SearchResults;
  genomeIdForUrl?: string;
  onMatchNavigation?: () => void;
};

const TranscriptSearchMatches = (props: TranscriptSearchMatchesProps) => {
  const { results, app, mode, genomeIdForUrl, onMatchNavigation } = props;
  const { matches } = results;

  return (
    <div className={styles.searchMatches}>
      {matches.map((match) => {
        const transcriptMatch = match as TranscriptSearchMatchType;
        const key = transcriptMatch.stable_id;

        return (
          <Match
            key={key}
            match={transcriptMatch}
            app={app}
            mode={mode}
            genomeIdForUrl={genomeIdForUrl}
            onMatchNavigation={onMatchNavigation}
          />
        );
      })}
    </div>
  );
};

type MatchProps = {
  match: TranscriptSearchMatchType;
  app: FeatureSearchAppName;
  mode: FeatureSearchMatchPosition;
  genomeIdForUrl?: string;
  onMatchNavigation?: () => void;
};

const Match = (props: MatchProps) => {
  const { app, mode, match, genomeIdForUrl } = props;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const dispatch = useAppDispatch();
  const [anchorElement, setAnchorElement] = useState<HTMLSpanElement | null>(
    null
  );

  const onMatchClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);
  };

  const onAppClick = () => {
    if (app === 'genomeBrowser') {
      dispatch(changeHighlightedTrackId(''));
    }

    setShouldShowTooltip(!shouldShowTooltip);
    props.onMatchNavigation?.();
  };

  const hideTooltip = () => setShouldShowTooltip(false);
  const symbolElement = match.symbol ? <span>{match.symbol}</span> : null;
  const stableIdElement = <span>{match.stable_id}</span>;

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl ?? match.genome_id,
    focus: buildFocusIdForUrl({
      type: 'transcript',
      objectId: match.unversioned_stable_id
    })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl ?? match.genome_id,
    entityId: buildFocusIdForUrl({
      type: 'transcript',
      objectId: match.unversioned_stable_id
    })
  });

  const links = {
    genomeBrowser: {
      url: urlForGenomeBrowser,
      replaceState: false
    },
    entityViewer: {
      url: urlForEntityViewer,
      replaceState: false
    }
  };

  const searchMatchAnchorClass = classNames(
    styles.searchMatchAnchor,
    styles[`${mode}SearchMatchAnchor`]
  );

  return (
    <>
      <div className={styles.searchMatch} onClick={onMatchClick}>
        <TextButton className={styles.searchMatchButton}>
          {symbolElement}
          {stableIdElement}
        </TextButton>
        <span className={searchMatchAnchorClass} ref={setAnchorElement} />
      </div>
      {shouldShowTooltip && anchorElement && (
        <PointerBox
          anchor={anchorElement}
          position={
            props.mode === 'interstitial'
              ? PointerBoxPosition.RIGHT_BOTTOM
              : PointerBoxPosition.BOTTOM_RIGHT
          }
          autoAdjust={true}
          className={classNames(
            styles.tooltip,
            pointerBoxStyles.pointerBoxShadow
          )}
          onOutsideClick={hideTooltip}
          onClose={hideTooltip}
        >
          <ViewInApp theme="dark" links={links} onAnyAppClick={onAppClick} />
        </PointerBox>
      )}
    </>
  );
};

export default TranscriptSearchMatches;
