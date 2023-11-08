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

import React from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/store';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';
import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';
import regulationLegends from 'src/content/app/genome-browser/constants/regulationLegends';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from '../TrackPanelList.scss';
import trackPanelItemStyles from './TrackPanelItem.scss';
import regulationStyles from 'src/content/app/genome-browser/components/drawer/drawer-views/regulation-legend/RegulationLegend.scss';
import { useGetRegulationStatsQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

const TrackPanelRegulationLegend = (props: { disabled: boolean }) => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const dispatch = useDispatch();
  const { trackDrawerOpened, reportTrackPanelSectionToggled } =
    useGenomeBrowserAnalytics();
  const { data: regulationStats } = useGetRegulationStatsQuery(activeGenomeId);

  if (!regulationStats) {
    return;
  }
  const availableRegulationLegends = regulationLegends.filter((legend) => {
    return Object.keys(regulationStats).includes(legend.stats_api_key);
  });

  const accordionHeading = 'Regulatory features';

  const accordionButtonClassNames = classNames(
    styles.trackPanelAccordionButton,
    {
      [styles.trackPanelAccordionButtonDisabled]: props.disabled
    }
  );

  const onShowMore = (group: string) => {
    trackDrawerOpened('regulation_legend');
    dispatch(
      changeDrawerViewForGenome({
        genomeId: activeGenomeId,
        drawerView: {
          name: 'regulation_legend',
          group
        }
      })
    );
  };

  return (
    <AccordionItem
      className={styles.trackPanelAccordionItem}
      uuid="regulation_legend"
    >
      <AccordionItemHeading className={styles.trackPanelAccordionHeader}>
        <AccordionItemButton
          disabled={props.disabled}
          className={accordionButtonClassNames}
          onToggle={(isExpanded: boolean) =>
            reportTrackPanelSectionToggled(accordionHeading, isExpanded)
          }
        >
          {accordionHeading}
        </AccordionItemButton>
      </AccordionItemHeading>
      {!props.disabled ? (
        <AccordionItemPanel className={styles.trackPanelAccordionItemContent}>
          <dl>
            {availableRegulationLegends.map((legend) => {
              const groupColourMarkerClass = classNames(
                regulationStyles.colourMarker,
                regulationStyles[`regulationColour${legend.id}`]
              );

              return (
                <SimpleTrackPanelItemLayout
                  key={legend.id}
                  onShowMore={() => onShowMore(legend.label)}
                >
                  <div className={trackPanelItemStyles.label}>
                    <span className={groupColourMarkerClass} />
                    <span className={trackPanelItemStyles.labelText}>
                      {legend.label}
                    </span>
                  </div>
                </SimpleTrackPanelItemLayout>
              );
            })}
          </dl>
        </AccordionItemPanel>
      ) : null}
    </AccordionItem>
  );
};

export default TrackPanelRegulationLegend;
