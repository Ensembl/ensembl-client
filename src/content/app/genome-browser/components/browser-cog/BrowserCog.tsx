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

import React, { useState } from 'react';
import { useTransition, animated } from '@react-spring/web';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import TrackSettingsPanel from '../track-settings-panel/TrackSettingsPanel';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import CogIcon from 'static/icons/icon_settings.svg';

import styles from './BrowserCogList.scss';

export type BrowserCogProps = {
  trackId: string;
};

const BrowserCog = (props: BrowserCogProps) => {
  const { trackId } = props;
  const { reportTrackSettingsOpened } = useGenomeBrowserAnalytics();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const toggleCog = () => {
    if (!isPanelOpen) {
      setIsPanelOpen(true);
      reportTrackSettingsOpened(trackId);
    } else {
      setIsPanelOpen(false);
    }
  };

  const cogIconConfig = {
    description: 'Configure Track',
    icon: CogIcon
  };

  const transition = useTransition(isPanelOpen, {
    config: { duration: 100 },
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 }
  });

  const closeTrackSettingsPanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      {isPanelOpen ? (
        <CloseButton onClick={toggleCog} />
      ) : (
        <ImageButton
          className={styles.browserCog}
          description={cogIconConfig.description}
          onClick={toggleCog}
          image={cogIconConfig.icon}
        />
      )}
      {transition((style, item) => {
        return (
          item && (
            <animated.div key="trackSettingsPanel" style={style}>
              <TrackSettingsPanel
                trackId={trackId}
                onClose={closeTrackSettingsPanel}
              />
            </animated.div>
          )
        );
      })}
    </>
  );
};

export default BrowserCog;
