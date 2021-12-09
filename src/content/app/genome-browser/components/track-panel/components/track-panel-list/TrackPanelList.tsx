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
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { GenomeTrackCategory } from 'src/shared/state/genome/genomeTypes';
import { EnsObjectTrack } from 'src/shared/state/focus-object/focusObjectTypes';
import {
  getBrowserActiveEnsObject,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getSelectedTrackPanelTab } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { getGenomeTrackCategoriesById } from 'src/shared/state/genome/genomeSelectors';

import TrackPanelGene from './track-panel-items/TrackPanelGene';
import TrackPanelRegularItem from './track-panel-items/TrackPanelRegularItem';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';

import styles from './TrackPanelList.scss';

export const TrackPanelList = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObject = useSelector(getBrowserActiveEnsObject);
  const selectedTrackPanelTab = useSelector(getSelectedTrackPanelTab);
  const genomeTrackCategories = useSelector(getGenomeTrackCategoriesById);

  if (!activeGenomeId) {
    return null; // will never happen, but makes typescript happy
  }

  const currentTrackCategories = genomeTrackCategories?.filter(
    (category: GenomeTrackCategory) =>
      category.types.includes(selectedTrackPanelTab)
  );

  const trackCategoryIds = currentTrackCategories
    ?.filter((category: GenomeTrackCategory) => category.track_list.length)
    .map((category: GenomeTrackCategory) => category.track_category_id);

  return (
    <div className={styles.trackPanelList}>
      {activeEnsObject?.type === 'gene' &&
      activeGenomeId &&
      activeEnsObject.stable_id ? (
        <section className="mainTrackItem">
          <TrackPanelGene
            focusObjectId={activeEnsObject.object_id}
            genomeId={activeGenomeId}
            geneId={activeEnsObject.stable_id}
          />
        </section>
      ) : null}
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
                  >
                    {category.label}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel
                  className={styles.trackPanelAccordionItemContent}
                >
                  <dl>
                    {category.track_list.map((track: EnsObjectTrack) => (
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
