import React, { useCallback, useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';

import analyticsTracking from 'src/services/analytics-service';
import BrowserTrackConfig from '../browser-track-config/BrowserTrackConfig';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as cogIcon } from 'static/img/shared/cog.svg';

import { Status } from 'src/shared/types/status';

export type BrowserCogProps = {
  cogActivated: boolean;
  trackId: string;
  updateSelectedCog: (trackId: string | null) => void;
};

const BrowserCog = (props: BrowserCogProps) => {
  const { cogActivated, updateSelectedCog, trackId } = props;

  const toggleCog = useCallback(() => {
    if (cogActivated === false) {
      updateSelectedCog(trackId);

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

  const getCogIconStatus = () => {
    const { cogActivated } = props;
    return cogActivated ? Status.SELECTED : Status.UNSELECTED;
  };

  const [showTrackConfig, setTrackConfigAnimation] = useState(cogActivated);
  useEffect(() => {
    if (cogActivated) {
      setTrackConfigAnimation(true);
      return;
    }
    setTrackConfigAnimation(false);
  }, [cogActivated]);

  const transitions = useTransition(showTrackConfig, null, {
    config: { duration: 100 },
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 }
  });

  return (
    <>
      <div style={imgInline}>
        <ImageButton
          status={getCogIconStatus()}
          description={cogIconConfig.description}
          onClick={toggleCog}
          image={cogIconConfig.icon}
        />
      </div>
      {transitions.map(({ item, key, props: style }) => {
        return (
          item && (
            <animated.div key={key} style={style}>
              <BrowserTrackConfig
                onClose={() => props.updateSelectedCog(null)}
              />
            </animated.div>
          )
        );
      })}
    </>
  );
};

export default BrowserCog;
