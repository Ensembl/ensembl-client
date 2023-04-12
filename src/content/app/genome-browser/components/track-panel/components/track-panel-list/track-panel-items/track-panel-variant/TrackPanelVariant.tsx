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

import { useAppDispatch } from 'src/store';
import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import SimpleTrackPanelItemLayout from '../track-panel-item-layout/SimpleTrackPanelItemLayout';
import VariantConsequence from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-consequence/VariantConsequence';
import VariantAllelesSequences from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-alleles-sequences/VariantAllelesSequences';
import VariantLocation from 'src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-location/VariantLocation';

import type { FocusVariant } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './TrackPanelVariant.scss';
import trackPanelItemStyles from '../TrackPanelItem.scss';

const TrackPanelVariant = (props: { focusVariant: FocusVariant }) => {
  const { focusVariant } = props;
  const { currentData: variantData } = useGbVariantQuery({
    genomeId: focusVariant.genome_id,
    variantId: focusVariant.object_id // TODO: change this to the appropriate id with which to query variation api
  });
  const dispatch = useAppDispatch();

  if (!variantData) {
    return null;
    // TODO: handle errors
  }

  const onShowMore = () => {
    dispatch(
      changeDrawerViewForGenome({
        genomeId: focusVariant.genome_id,
        drawerView: {
          name: 'variant_summary',
          variantId: focusVariant.object_id
        }
      })
    );
  };

  const variant = variantData.variant;
  const mostSevereConsequence = (
    <VariantConsequence variant={variant} showColour={true} />
  );

  return (
    <>
      <SimpleTrackPanelItemLayout onShowMore={onShowMore}>
        <span className={trackPanelItemStyles.labelTextStrong}>
          {focusVariant.label}
        </span>
      </SimpleTrackPanelItemLayout>

      <div className={styles.variantDetais}>
        {mostSevereConsequence && (
          <div>
            <span
              className={classNames(styles.labelText, styles.labelFullLength)}
            >
              Most severe consequence
            </span>
            {mostSevereConsequence}
          </div>
        )}
        <div className={styles.rowField}>
          <span className={styles.labelText}>Alleles</span>
          <VariantAllelesSequences alleles={variant.alleles} />
        </div>
        <div className={styles.rowField}>
          <span className={styles.labelText}>Location</span>
          <VariantLocation variant={variant} />
        </div>
      </div>
    </>
  );
};

export default TrackPanelVariant;
