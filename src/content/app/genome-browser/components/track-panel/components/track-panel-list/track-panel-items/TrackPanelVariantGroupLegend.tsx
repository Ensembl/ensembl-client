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
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'src/shared/components/accordion';
import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';
import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from '../TrackPanelList.module.css';
import trackPanelItemStyles from './TrackPanelItem.module.css';
import variantStyles from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-group-legend/VariantGroupLegend.module.css';

const TrackPanelVariantGroupLegend = (props: { disabled: boolean }) => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const dispatch = useDispatch();
  const { trackDrawerOpened, reportTrackPanelSectionToggled } =
    useGenomeBrowserAnalytics();
  const accordionHeading = 'Short variant groups';

  const accordionButtonClassNames = classNames(
    styles.trackPanelAccordionButton,
    {
      [styles.trackPanelAccordionButtonDisabled]: props.disabled
    }
  );

  const onShowMore = (group: string) => {
    trackDrawerOpened('variant_group_legend');
    dispatch(
      changeDrawerViewForGenome({
        genomeId: activeGenomeId,
        drawerView: {
          name: 'variant_group_legend',
          group
        }
      })
    );
  };

  return (
    <>
      <AccordionItem
        className={styles.trackPanelAccordionItem}
        uuid="variant_legend"
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
              {variantGroups.map((group) => {
                const groupColourMarkerClass = classNames(
                  variantStyles.colourMarker,
                  variantStyles[`variantColour${group.id}`]
                );

                return (
                  <SimpleTrackPanelItemLayout
                    key={group.id}
                    onShowMore={() => onShowMore(group.label)}
                  >
                    <div className={trackPanelItemStyles.label}>
                      <span className={groupColourMarkerClass} />
                      <span className={trackPanelItemStyles.labelText}>
                        {` ${pluralise(
                          group.label,
                          group.variant_types.length
                        )}`}
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
