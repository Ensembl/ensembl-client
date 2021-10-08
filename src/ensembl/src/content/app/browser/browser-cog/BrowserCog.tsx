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

import React, { useCallback, useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';

import analyticsTracking from 'src/services/analytics-service';
import BrowserTrackConfig from '../browser-track-config/BrowserTrackConfig';

import CloseButton from 'ensemblRoot/src/shared/components/close-button/CloseButton';
import ImageButton from 'ensemblRoot/src/shared/components/image-button/ImageButton';

import { ReactComponent as cogIcon } from 'static/img/shared/cog.svg';

export type BrowserCogProps = {
  cogActivated: boolean;
  trackId: string;
  updateSelectedCog: (trackId: string | null) => void;
};

const BrowserCog = (props: BrowserCogProps) => {
  const { cogActivated, updateSelectedCog, trackId } = props;

  const toggleCog = useCallback(() => {
    if (cogActivated === false) {
      // Wrapping updateSelectedCog in a setTimeout below is a cheap workaround for the way we currently keep track
      // of which BrowserTrackConfig is open.
      // Imagine a user clicks on one cog (to open one BrowserTrackConfig), and then clicks on another cog.
      // This will trigger two events that we are tracking: 1) click on a new cog; 2) click outside the opened BrowserTrackConfig.
      // Using the setTimeout to bump the execution of updateSelectedCog to the end of the queue,
      // we allow the time for the click outside the opened BrowserTrackConfig to get registered and for the component to get closed
      // before dispatching the action that will open the BrowserTrackConfig for the newly clicked cog.
      // (In the future, we should probably review how the state of the cogs is maintained. Does it even need to be in redux?)
      setTimeout(() => {
        updateSelectedCog(trackId);
      }, 0);

      analyticsTracking.trackEvent({
        category: 'track_settings',
        label: trackId,
        action: 'opened'
      });
    } else {
      updateSelectedCog(null);
    }
  }, [cogActivated]);

  const imgInline = {
    height: '18px',
    width: '18px'
  };

  const cogIconConfig = {
    description: 'Configure Track',
    icon: cogIcon
  };

  const [showTrackConfig, setTrackConfigAnimation] = useState(cogActivated);
  useEffect(() => {
    if (cogActivated) {
      setTrackConfigAnimation(true);
      return;
    }
    setTrackConfigAnimation(false);
  }, [cogActivated]);

  const transition = useTransition(showTrackConfig, {
    config: { duration: 100 },
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 }
  });

  return (
    <>
      <div style={imgInline}>
        {cogActivated ? (
          <CloseButton onClick={toggleCog} />
        ) : (
          <ImageButton
            description={cogIconConfig.description}
            onClick={toggleCog}
            image={cogIconConfig.icon}
          />
        )}
      </div>
      {transition((style, item) => {
        return (
          item && (
            <animated.div key="browserTrackConfig" style={style}>
              <BrowserTrackConfig />
            </animated.div>
          )
        );
      })}
    </>
  );
};

export default BrowserCog;
