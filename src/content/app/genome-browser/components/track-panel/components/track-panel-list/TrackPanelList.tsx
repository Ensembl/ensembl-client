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

import { memo, type ReactNode } from 'react';
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
import TrackPanelTranscript from './track-panel-items/track-panel-transcript/TrackPanelTranscript';
import TrackPanelVariant from './track-panel-items/track-panel-variant/TrackPanelVariant';
import TrackPanelRegularItem from './track-panel-items/TrackPanelRegularItem';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';
import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import TrackPanelLocationNavigation from './track-panel-items/TrackPanelLocationNavigation';
import TrackPanelVariantGroupLegend from './track-panel-items/TrackPanelVariantGroupLegend';
import TrackPanelRegulationLegend from './track-panel-items/TrackPanelRegulationLegend';
import SearchButton from 'src/shared/components/search-button/SearchButton';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type {
  FocusObject as FocusObjectType,
  FocusGene as FocusGeneType,
  FocusTranscript as FocusTranscriptType,
  FocusVariant as FocusVariantType
} from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './TrackPanelList.module.css';

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

  const currentTrackCategories = genomeTrackCategories?.filter(
    (category: GenomeTrackCategory) => category.type === selectedTrackPanelTab
  );

  const trackCategoryIds =
    currentTrackCategories
      ?.filter((category: GenomeTrackCategory) => category.track_list.length)
      .map((category: GenomeTrackCategory) => category.track_category_id) ?? [];

  return (
    <div className={styles.trackPanelList}>
      <FocusObject focusObject={activeFocusObject} />
      <div className={styles.modalLinksWrapper}>
        <SearchButton onClick={openSearch} label="Find" />
      </div>

      <div className={styles.accordionContainer}>
        <Accordion
          className={styles.trackPanelAccordion}
          allowMultipleExpanded={true}
          preExpanded={[
            'genomic_location',
            ...trackCategoryIds,
            'variant_legend',
            'regulation_legend'
          ]}
        >
          {selectedTrackPanelTab === TrackSet.GENOMIC && (
            <TrackPanelLocationNavigation />
          )}

          {selectedTrackPanelTab === TrackSet.VARIATION && (
            <TrackPanelVariantGroupLegend
              disabled={trackCategoryIds.length === 0}
            />
          )}

          {selectedTrackPanelTab === TrackSet.REGULATION && (
            <TrackPanelRegulationLegend
              disabled={trackCategoryIds.length === 0}
            />
          )}

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
                  {category.track_category_id === 'genes-transcripts' && (
                    <div className={styles.trackPanelSectionLegend}>
                      <span className={styles.trackPanelSectionLegendMarker} />
                      <span>Genes & transcripts</span>
                    </div>
                  )}
                  <dl>
                    {category.track_list.map((track) => (
                      <TrackPanelRegularItem
                        {...track}
                        genomeId={activeGenomeId}
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

const FocusObject = (props: { focusObject: FocusObjectType | null }) => {
  const { focusObject } = props;
  let content: ReactNode;

  if (focusObject?.type === 'gene') {
    content = <FocusGene focusGene={focusObject} />;
  } else if (focusObject?.type === 'transcript') {
    content = <FocusTranscript focusTranscript={focusObject} />;
  } else if (focusObject?.type === 'variant') {
    content = <FocusVariant focusVariant={focusObject} />;
  }

  if (content) {
    return <section className={styles.mainTrackItem}>{content}</section>;
  } else {
    return null;
  }
};

const FocusGene = (props: { focusGene: FocusGeneType }) => {
  const { genome_id, object_id, stable_id } = props.focusGene;

  return (
    <TrackPanelGene
      focusObjectId={object_id}
      genomeId={genome_id}
      geneId={stable_id}
    />
  );
};

const FocusVariant = (props: { focusVariant: FocusVariantType }) => {
  return <TrackPanelVariant focusVariant={props.focusVariant} />;
};

const FocusTranscript = (props: { focusTranscript: FocusTranscriptType }) => {
  return <TrackPanelTranscript focusTranscript={props.focusTranscript} />;
};

export default memo(TrackPanelList);
