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

import React, { forwardRef, type ForwardedRef } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getAllTrackSettingsForGenome } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';

import {
  updateTrackSettingsAndSave,
  type FocusVariantTrack
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

import styles from '../TrackSettingsPanel.scss';

type Props = {
  trackId: string;
};

const VariantTrackSettings = (
  props: Props,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const allTrackSettings = useAppSelector((state) =>
    getAllTrackSettingsForGenome(state, activeGenomeId)
  );

  const trackSettings = allTrackSettings?.settingsForIndividualTracks[
    props.trackId
  ] as FocusVariantTrack | undefined;
  const dispatch = useAppDispatch();

  const { toggleFocusVariantTrackSetting, toggleTrackName } =
    useGenomeBrowser();

  const onSettingToggle = (setting: string, isOn: boolean) => {
    toggleFocusVariantTrackSetting({
      settingName: setting,
      isOn
    });
    dispatch(
      updateTrackSettingsAndSave({
        genomeId: activeGenomeId,
        trackId: props.trackId,
        settings: { [setting]: isOn }
      })
    );
  };

  const onTrackNameToggle = (isOn: boolean) => {
    toggleTrackName({
      trackId: 'focus',
      shouldShowTrackName: isOn
    });
    dispatch(
      updateTrackSettingsAndSave({
        genomeId: activeGenomeId,
        trackId: props.trackId,
        settings: { name: isOn }
      })
    );
  };

  return (
    <div className={styles.trackSettingsPanel} ref={ref}>
      <div className={styles.section}>
        <div className={styles.subLabel}>SNVs</div>
        <div>
          <div className={styles.toggleWrapper}>
            <label>Variant IDs</label>
            <SlideToggle
              isOn={trackSettings?.settings['label-snv-id'] ?? false}
              onChange={(isOn) => onSettingToggle('label-snv-id', isOn)}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Variant alleles</label>
            <SlideToggle
              isOn={trackSettings?.settings['label-snv-alleles'] ?? false}
              onChange={(isOn) => onSettingToggle('label-snv-alleles', isOn)}
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
              isOn={trackSettings?.settings['label-other-id'] ?? false}
              onChange={(isOn) => onSettingToggle('label-other-id', isOn)}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Variant alleles</label>
            <SlideToggle
              isOn={trackSettings?.settings['label-other-alleles'] ?? false}
              onChange={(isOn) => onSettingToggle('label-other-alleles', isOn)}
              className={styles.slideToggle}
            />
          </div>
          <div className={styles.toggleWrapper}>
            <label>Variant extent</label>
            <SlideToggle
              isOn={trackSettings?.settings['show-extents'] ?? false}
              onChange={(isOn) => onSettingToggle('show-extents', isOn)}
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
              isOn={trackSettings?.settings['name'] ?? false}
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
