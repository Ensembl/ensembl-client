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
import type {
  GeneSearchMatch,
  SearchMatch,
  VariantSearchMatch
} from 'src/shared/types/search-api/search-match';
import type { AppName } from 'src/shared/state/in-app-search/inAppSearchSlice';
import type { AppName as AppNameForViewInApp } from 'src/shared/components/view-in-app/ViewInApp';
import type { InAppSearchMode } from './InAppSearch';
import { FeatureSearchModeType } from 'src/shared/types/search-api/search-constants';

import styles from './InAppSearch.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

type InAppSearchMatchesProps = {
  results?: SearchResults;
  featureSearchMode: string;
  app: AppName;
  mode: InAppSearchMode;
  genomeIdForUrl: string; // TODO: remove this when backend starts including this id in the response
  onMatchNavigation?: () => void; // currently, there are no requirements for data to be passed in this callback
};

const InAppSearchMatches = (props: InAppSearchMatchesProps) => {
  const {
    results,
    featureSearchMode,
    app,
    mode,
    genomeIdForUrl,
    onMatchNavigation
  } = props;
  if (!results) {
    return;
  }

  const { matches } = results;
  const isGeneSearchMode =
    featureSearchMode === FeatureSearchModeType.GENE_SEARCH_MODE;
  const isVariantSearchMode =
    featureSearchMode === FeatureSearchModeType.VARIANT_SEARCH_MODE;

  return (
    <div className={styles.searchMatches}>
      {isGeneSearchMode &&
        matches.map((match, index) => (
          <InAppGeneSearchMatch
            key={(match as GeneSearchMatch).stable_id}
            match={match as GeneSearchMatch}
            app={app}
            mode={mode}
            genomeIdForUrl={genomeIdForUrl}
            position={index + 1}
            onMatchNavigation={onMatchNavigation}
          />
        ))}
      {isVariantSearchMode &&
        matches.map((match, index) => {
          const variantMatch = match as VariantSearchMatch;
          const key = `${variantMatch.region_name}:${variantMatch.region_name}:${variantMatch.start}`;
          return (
            <InAppVariantSearchMatch
              key={key}
              match={variantMatch}
              app={app}
              mode={mode}
              genomeIdForUrl={genomeIdForUrl}
              position={index + 1}
              onMatchNavigation={onMatchNavigation}
            />
          );
        })}
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

const InAppVariantSearchMatch = (props: InAppSearchMatchProps) => {
  const { app, mode, position, match, genomeIdForUrl } = props;
  const { region_name, start, variant_name } = match as VariantSearchMatch;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const dispatch = useAppDispatch();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const variantIdForUrl = `${region_name}:${start}:${variant_name}`;

  const onMatchClick = () => {
    setShouldShowTooltip(!shouldShowTooltip);

    if (app === 'entityViewer') {
      analyticsTracking.trackEvent({
        category: `${app}_${mode}_search`,
        action: 'select_link',
        label: variantIdForUrl,
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

  const urlForGenomeBrowser = urlFor.browser({
    genomeId: genomeIdForUrl,
    focus: buildFocusIdForUrl({ type: 'variant', objectId: variantIdForUrl })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genomeIdForUrl,
    entityId: buildFocusIdForUrl({
      type: 'variant',
      objectId: variantIdForUrl
    })
  });

  // NOTE: If this panel opens in genome browser, we should add `replaceState: true`
  // to the genomeBrowser link config below
  const links = {
    genomeBrowser: {
      url: urlForGenomeBrowser
    },
    entityViewer: {
      url: urlForEntityViewer
    }
  };

  return (
    <>
      <div className={styles.searchMatch} onClick={onMatchClick}>
        <TextButton className={styles.searchMatchButton}>
          {variant_name}
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
          <ViewInApp theme="dark" links={links} onAnyAppClick={onAppClick} />
        </PointerBox>
      )}
    </>
  );
};

const InAppGeneSearchMatch = (props: InAppSearchMatchProps) => {
  const { app, mode, position, match } = props;
  const { symbol, stable_id } = match as GeneSearchMatch;
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
          <GeneMatchDetails {...props} onClick={onAppClick} />
        </PointerBox>
      )}
    </>
  );
};

const GeneMatchDetails = (
  props: Pick<InAppSearchMatchProps, 'match' | 'mode' | 'genomeIdForUrl'> & {
    onClick: (appName?: AppNameForViewInApp) => void;
  }
) => {
  const { match, genomeIdForUrl } = props;
  const geneSearchMatch = match as GeneSearchMatch;
  const { unversioned_stable_id } = geneSearchMatch;

  const formattedLocation = getFormattedLocation({
    chromosome: geneSearchMatch.slice.region.name,
    start: geneSearchMatch.slice.location.start,
    end: geneSearchMatch.slice.location.end
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
        <span className={styles.strong}>{geneSearchMatch.biotype}</span>
      </div>

      <div>
        <span>{getStrandDisplayName(geneSearchMatch.slice.strand.code)}</span>
      </div>

      <div>{formattedLocation}</div>

      <div>
        <span className={classNames(styles.strong, styles.withExtraSpaceRight)}>
          {geneSearchMatch.transcript_count}{' '}
        </span>
        {pluralise('transcript', geneSearchMatch.transcript_count)}
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
