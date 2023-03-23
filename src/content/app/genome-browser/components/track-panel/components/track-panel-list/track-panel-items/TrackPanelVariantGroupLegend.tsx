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

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';
import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import { type VariantGroups } from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-group-legend/variantGroups';

import styles from '../TrackPanelList.scss';
import trackPanelItemStyles from './TrackPanelItem.scss';
import variantStyles from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-group-legend/VariantGroupLegend.scss';

const TrackPanelVariantGroupLegend = (props: {
  groups: VariantGroups;
  shouldShowLegend: boolean;
  onShowMore: (group: string) => void;
}) => {
  const { groups, onShowMore, shouldShowLegend } = props;
  const { reportTrackPanelSectionToggled } = useGenomeBrowserAnalytics();
  const accordionHeading = 'Short variant groups';
  const accordionButtonClassNames = classNames(
    styles.trackPanelAccordionButton,
    {
      [styles.trackPanelAccordionButtonDisabled]: !shouldShowLegend
    }
  );
  return (
    <>
      <AccordionItem
        className={styles.trackPanelAccordionItem}
        uuid="variant_legend"
      >
        <AccordionItemHeading className={styles.trackPanelAccordionHeader}>
          <AccordionItemButton
            disabled={!shouldShowLegend}
            className={accordionButtonClassNames}
            onToggle={(isExpanded: boolean) =>
              reportTrackPanelSectionToggled(accordionHeading, isExpanded)
            }
          >
            {accordionHeading}
          </AccordionItemButton>
        </AccordionItemHeading>
        {shouldShowLegend ? (
          <AccordionItemPanel className={styles.trackPanelAccordionItemContent}>
            <dl>
              {groups.map((group) => {
                const groupColorMarkerClass = classNames(
                  variantStyles.colourMarker,
                  variantStyles[`variantColour${group.id}`]
                );

                return (
                  <SimpleTrackPanelItemLayout
                    key={group.id}
                    onShowMore={() => onShowMore(group.label)}
                  >
                    <div className={trackPanelItemStyles.label}>
                      <span className={groupColorMarkerClass} />
                      <span className={trackPanelItemStyles.labelText}>
                        {group.label}
                      </span>
                    </div>
                  </SimpleTrackPanelItemLayout>
                );
              })}
            </dl>
          </AccordionItemPanel>
        ) : null}
      </AccordionItem>
    </>
  );
};

export default TrackPanelVariantGroupLegend;
