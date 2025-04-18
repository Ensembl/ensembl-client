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

import { useState, useRef } from 'react';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { useAppDispatch } from 'src/store';

import { changeHighlightedTrackId } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';
import { getStrandDisplayName } from 'src/shared/helpers/formatters/strandFormatter';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import * as urlFor from 'src/shared/helpers/urlHelper';

import analyticsTracking from 'src/services/analytics-service';

import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { SearchMatch } from 'src/shared/types/search-api/search-match';
import type { AppName } from 'src/shared/state/in-app-search/inAppSearchSlice';
import type { AppName as AppNameForViewInApp } from 'src/shared/components/view-in-app/ViewInApp';
import type { InAppSearchMode } from './InAppSearch';

import styles from './InAppSearch.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

type InAppSearchMatchesProps = SearchResults & {
  app: AppName;
  mode: InAppSearchMode;
  genomeIdForUrl: string; // TODO: remove this when backend starts including this id in the response
  onMatchNavigation?: () => void; // currently, there are no requirements for data to be passed in this callback
};

const InAppSearchMatches = (props: InAppSearchMatchesProps) => {
  const componentClasses = classNames(styles.searchMatches, {
    [styles.searchMatchesInSidebar]: props.mode === 'sidebar'
  });

  return (
    <div className={componentClasses}>
      {props.matches.map((match, index) => (
        <InAppSearchMatch
          key={match.stable_id}
          match={match}
          app={props.app}
          mode={props.mode}
          genomeIdForUrl={props.genomeIdForUrl}
          position={index + 1}
          onMatchNavigation={props.onMatchNavigation}
        />
      ))}
    </div>
  );
};

type InAppSearchMatchProps = {
  match: SearchMatch;
  app: AppName;
  mode: InAppSearchMode;
  genomeIdForUrl: string;
  position: number;
  onMatchNavigation?: () => void;
};

const InAppSearchMatch = (props: InAppSearchMatchProps) => {
  const {
    app,
    mode,
    position,
    match: { symbol, stable_id }
  } = props;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const dispatch = useAppDispatch();
  const anchorRef = useRef<HTMLSpanElement>(null);

  const onMatchClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);

    if (app === 'entityViewer') {
      analyticsTracking.trackEvent({
        category: `${app}_${mode}_search`,
        action: 'select_link',
        label: `${symbol}: ${stable_id}`,
        value: position
      });
    }
  };

  const onAppClick = (selectedAppName?: AppNameForViewInApp) => {
    if (app === 'genomeBrowser') {
      dispatch(changeHighlightedTrackId(''));
    }

    if (app === 'entityViewer') {
      analyticsTracking.trackEvent({
        category: `${app}_${mode}_search`,
        action: 'select_app',
        label: selectedAppName
      });
    }

    setShouldShowTooltip(!shouldShowTooltip);
    props.onMatchNavigation?.();
  };

  const hideTooltip = () => setShouldShowTooltip(false);

  const symbolElement = symbol ? <span>{symbol}</span> : null;
  const stableIdElement = <span>{stable_id}</span>;

  return (
    <>
      <div className={styles.searchMatch} onClick={onMatchClick}>
        <TextButton className={styles.searchMatchButton}>
          {symbolElement}
          {stableIdElement}
        </TextButton>
        <span
          className={getSearchMatchAnchorClasses(props.mode)}
          ref={anchorRef}
        />
      </div>
      {shouldShowTooltip && anchorRef.current && (
        <PointerBox
          anchor={anchorRef.current}
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
          <MatchDetails {...props} onClick={onAppClick} />
        </PointerBox>
      )}
    </>
  );
};

const MatchDetails = (
  props: Pick<InAppSearchMatchProps, 'match' | 'mode' | 'genomeIdForUrl'> & {
    onClick: (appName?: AppNameForViewInApp) => void;
  }
) => {
  const { match, genomeIdForUrl } = props;
  const { unversioned_stable_id } = match;

  const formattedLocation = getFormattedLocation({
    chromosome: match.slice.region.name,
    start: match.slice.location.start,
    end: match.slice.location.end
  });

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: buildFocusIdForUrl({ type: 'gene', objectId: unversioned_stable_id })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: buildFocusIdForUrl({
      type: 'gene',
      objectId: unversioned_stable_id
    })
  });

  const links = {
    genomeBrowser: {
      url: urlForGenomeBrowser,
      replaceState: true // TODO: could be more complicated than that; depending on the app
    },
    entityViewer: {
      url: urlForEntityViewer,
      replaceState: false
    }
  };

  return (
    <div className={styles.tooltipContent}>
      <div>
        <span className={styles.withExtraSpaceRight}>Biotype </span>
        <span className={styles.strong}>{match.biotype}</span>
      </div>

      <div>
        <span>{getStrandDisplayName(match.slice.strand.code)}</span>
      </div>

      <div>{formattedLocation}</div>

      <div>
        <span className={classNames(styles.strong, styles.withExtraSpaceRight)}>
          {match.transcript_count}{' '}
        </span>
        {pluralise('transcript', match.transcript_count)}
      </div>

      <div>
        <ViewInApp theme="dark" links={links} onAnyAppClick={props.onClick} />
      </div>
    </div>
  );
};

const getSearchMatchAnchorClasses = (mode: InAppSearchMode) => {
  return classNames(
    styles.searchMatchAnchor,
    styles[`searchMatchAnchor${upperFirst(mode)}`]
  );
};

export default InAppSearchMatches;
