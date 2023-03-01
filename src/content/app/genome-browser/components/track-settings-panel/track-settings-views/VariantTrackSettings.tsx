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

import React, { useState, forwardRef, type ForwardedRef } from 'react';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

import styles from '../TrackSettingsPanel.scss';

type Props = {
  trackId: string;
};

const VariantTrackSettings = (
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const [shouldShowSnvIds, setShouldShowSnvIds] = useState(false);
  const [shouldShowSnvAlleles, setShouldShowSnvAlleles] = useState(false);
  const [shouldShowOtherVariantIds, setShouldShowOtherVariantIds] =
    useState(false);
  const [shouldShowOtherVariantAlleles, setShouldShowOtherVariantAlleles] =
    useState(false);
  const [shouldShowVariantExtent, setShouldShowVariantExtent] = useState(false);
  const [shouldShowTrackName, setShouldShowTrackName] = useState(false);

  const { toggleFocusVariantTrackSetting, toggleTrackName } =
    useGenomeBrowser();

  const onSnvIdsToggle = () => {
    toggleFocusVariantTrackSetting({
      settingName: 'label-snv-id',
      isOn: !shouldShowSnvIds
    });
    setShouldShowSnvIds(!shouldShowSnvIds);
  };

  const onSnvAllelesToggle = () => {
    toggleFocusVariantTrackSetting({
      settingName: 'label-snv-alleles',
      isOn: !shouldShowSnvAlleles
    });
    setShouldShowSnvAlleles(!shouldShowSnvAlleles);
  };

  const onOtherVariantIdsToggle = () => {
    toggleFocusVariantTrackSetting({
      settingName: 'label-other-id',
      isOn: !shouldShowOtherVariantIds
    });
    setShouldShowOtherVariantIds(!shouldShowOtherVariantIds);
  };

  const onOtherVariantAllelesToggle = () => {
    toggleFocusVariantTrackSetting({
      settingName: 'label-other-alleles',
      isOn: !shouldShowOtherVariantAlleles
    });
    setShouldShowOtherVariantAlleles(!shouldShowOtherVariantAlleles);
  };

  const onVariantExtentToggle = () => {
    toggleFocusVariantTrackSetting({
      settingName: 'show-extents',
      isOn: !shouldShowVariantExtent
    });
    setShouldShowVariantExtent(!shouldShowVariantExtent);
  };

  const onTrackNameToggle = () => {
    toggleTrackName({
      trackId: 'focus',
      shouldShowTrackName: !shouldShowTrackName
    });

    setShouldShowTrackName(!shouldShowTrackName);
  };

  return (
    <div className={styles.trackSettingsPanel} ref={ref}>
      <div className={styles.section}>
        <div className={styles.subLabel}>SNVs</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Variant IDs</label>
            <SlideToggle
              isOn={shouldShowSnvIds}
              onChange={onSnvIdsToggle}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Variant alleles</label>
            <SlideToggle
              isOn={shouldShowSnvAlleles}
              onChange={onSnvAllelesToggle}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.subLabel}>Other classes</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Variant IDs</label>
            <SlideToggle
              isOn={shouldShowOtherVariantIds}
              onChange={onOtherVariantIdsToggle}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Variant alleles</label>
            <SlideToggle
              isOn={shouldShowOtherVariantAlleles}
              onChange={onOtherVariantAllelesToggle}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Variant extent</label>
            <SlideToggle
              isOn={shouldShowVariantExtent}
              onChange={onVariantExtentToggle}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.subLabel}>All tracks</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Track name</label>
            <SlideToggle
              isOn={false}
              onChange={onTrackNameToggle}
              className={styles.slideToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(VariantTrackSettings);
