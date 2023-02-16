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

import React, { memo } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import {
  getBrowserActiveFocusObject,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getSelectedTrackPanelTab } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import {
  BrowserSidebarModalView,
  openBrowserSidebarModal
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import TrackPanelGene from './track-panel-items/TrackPanelGene';
import TrackPanelRegularItem from './track-panel-items/TrackPanelRegularItem';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';

import SearchIcon from 'static/icons/icon_search.svg';
import ResetIcon from 'static/icons/icon_reset.svg';

import styles from './TrackPanelList.scss';

export const TrackPanelList = () => {
  // by the time this component renders, genome id should be available
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const activeFocusObject = useAppSelector(getBrowserActiveFocusObject);
  const selectedTrackPanelTab = useAppSelector(getSelectedTrackPanelTab);
  const { reportTrackPanelSectionToggled } = useGenomeBrowserAnalytics();

  const dispatch = useAppDispatch();

  const { data: genomeTrackCategories } = useGenomeTracksQuery(activeGenomeId);

  const openSearch = () => {
    dispatch(openBrowserSidebarModal(BrowserSidebarModalView.SEARCH));
  };

  const openNavigateModal = () => {
    dispatch(openBrowserSidebarModal(BrowserSidebarModalView.NAVIGATE));
  };

  const currentTrackCategories = genomeTrackCategories?.filter(
    (category: GenomeTrackCategory) =>
      category.types.includes(selectedTrackPanelTab)
  );

  const trackCategoryIds = currentTrackCategories
    ?.filter((category: GenomeTrackCategory) => category.track_list.length)
    .map((category: GenomeTrackCategory) => category.track_category_id);

  return (
    <div className={styles.trackPanelList}>
      {activeFocusObject?.type === 'gene' &&
      activeGenomeId &&
      activeFocusObject.stable_id ? (
        <section className={`${styles.mainTrackItem}`}>
          <TrackPanelGene
            focusObjectId={activeFocusObject.object_id}
            genomeId={activeGenomeId}
            geneId={activeFocusObject.stable_id}
          />
        </section>
      ) : null}

      <div className={styles.modalLinksWrapper}>
        <div className={styles.modalLink} onClick={openSearch}>
          <span>Find a gene</span>
          <SearchIcon />
        </div>
        <div className={styles.modalLink} onClick={openNavigateModal}>
          <span>Change location</span>
          <ResetIcon />
        </div>
      </div>

      <div className={styles.accordionContainer}>
        <Accordion
          className={styles.trackPanelAccordion}
          allowMultipleExpanded={true}
          preExpanded={trackCategoryIds}
        >
          {currentTrackCategories?.map((category: GenomeTrackCategory) => {
            const accordionButtonClassNames = classNames(
              styles.trackPanelAccordionButton,
              {
                [styles.trackPanelAccordionButtonDisabled]:
                  !category.track_list.length
              }
            );

            return (
              <AccordionItem
                className={styles.trackPanelAccordionItem}
                uuid={category.track_category_id}
                key={category.track_category_id}
              >
                <AccordionItemHeading
                  className={styles.trackPanelAccordionHeader}
                >
                  <AccordionItemButton
                    className={accordionButtonClassNames}
                    disabled={!category.track_list.length}
                    onToggle={(isExpanded: boolean) =>
                      reportTrackPanelSectionToggled(category.label, isExpanded)
                    }
                  >
                    {category.label}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel
                  className={styles.trackPanelAccordionItemContent}
                >
                  <dl>
                    {category.track_list.map((track) => (
                      <TrackPanelRegularItem
                        {...track}
                        genomeId={activeGenomeId}
                        category={category.track_category_id}
                        key={track.track_id}
                      />
                    ))}
                  </dl>
                </AccordionItemPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default memo(TrackPanelList);
