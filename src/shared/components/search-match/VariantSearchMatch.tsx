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

import analyticsTracking from 'src/services/analytics-service';

import PointerBox, {
  Position as PointerBoxPosition
} from 'src/shared/components/pointer-box/PointerBox';
import TextButton from 'src/shared/components/text-button/TextButton';
import ViewInApp from 'src/shared/components/view-in-app/ViewInApp';
import { SearchResults } from 'src/shared/types/search-api/search-results';

import type { VariantSearchMatch as VariantSearchMatchType } from 'src/shared/types/search-api/search-match';
import type { AppName as AppNameForViewInApp } from 'src/shared/components/view-in-app/ViewInApp';

import styles from './SearchMatch.module.css';
import pointerBoxStyles from 'src/shared/components/pointer-box/PointerBox.module.css';

export type VariantSearchAppName =
  | 'speciesHome'
  | 'genomeBrowser'
  | 'entityViewer';

export type VariantSearchMatchMode = 'sidebar' | 'interstitial';

type VariantSearchMatchProps = {
  results?: SearchResults;
  app: VariantSearchAppName;
  mode: VariantSearchMatchMode;
  onMatchNavigation?: () => void; // currently, there are no requirements for data to be passed in this callback
};

const VariantSearchMatch = (props: VariantSearchMatchProps) => {
  const { results, app, mode, onMatchNavigation } = props;
  if (!results) {
    return;
  }

  const { matches } = results;

  return (
    <div className={styles.searchMatches}>
      {matches.map((match, index) => {
        const variantMatch = match as VariantSearchMatchType;
        const key = `${variantMatch.variant_name}:${variantMatch.region_name}:${variantMatch.start}`;

        return (
          <Match
            key={key}
            match={variantMatch}
            app={app}
            mode={mode}
            position={index + 1}
            onMatchNavigation={onMatchNavigation}
          />
        );
      })}
    </div>
  );
};

type MatchProps = {
  match: VariantSearchMatchType;
  app: VariantSearchAppName;
  mode: VariantSearchMatchMode;
  position: number;
  onMatchNavigation?: () => void; // currently, there are no requirements for data to be passed in this callback
};

const Match = (props: MatchProps) => {
  const { app, mode, position, match } = props;
  const { region_name, start, variant_name, genome_id } =
    match as VariantSearchMatchType;
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const dispatch = useAppDispatch();
  const [anchorElement, setAnchorElement] = useState<HTMLSpanElement | null>(
    null
  );
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
    genomeId: genome_id,
    focus: buildFocusIdForUrl({ type: 'variant', objectId: variantIdForUrl })
  });

  const urlForEntityViewer = urlFor.entityViewer({
    genomeId: genome_id,
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

  const searchMatchAnchorClass = classNames(
    styles.searchMatchAnchor,
    styles[`searchMatchAnchor${mode}`]
  );

  return (
    <>
      <div className={styles.searchMatch} onClick={onMatchClick}>
        <TextButton className={styles.searchMatchButton}>
          {variant_name}
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

export default VariantSearchMatch;
