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

import { useGbVariantQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import type { FocusVariant } from 'src/shared/types/focus-object/focusObjectTypes';

import styles from './TrackPanelItem.scss';

const TrackPanelVariant = (props: { focusVariant: FocusVariant }) => {
  const { focusVariant } = props;
  const { currentData } = useGbVariantQuery({
    genomeId: focusVariant.genome_id,
    variantId: focusVariant.object_id // TODO: change this to the appropriate id with which to query variation api
  });

  if (!currentData) {
    return null;
    // TODO: handle errors
  }

  const children = (
    <div className={styles.label}>
      <span className={styles.labelTextStrong}>{focusVariant.label}</span>
    </div>
  );

  return <SimpleTrackPanelItemLayout>{children}</SimpleTrackPanelItemLayout>;
};

export default TrackPanelVariant;
