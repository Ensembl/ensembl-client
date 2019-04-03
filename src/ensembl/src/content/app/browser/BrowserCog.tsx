import React, { FunctionComponent, useCallback, CSSProperties } from 'react';

import cogOnIcon from 'static/img/shared/cog-on.svg';
import cogOffIcon from 'static/img/shared/cog.svg';

type BrowserCogProps = {
  cogActivated: boolean;
  index: string;
  updateSelectedCog: (index: string) => void;
};

const BrowserCog: FunctionComponent<BrowserCogProps> = (
  props: BrowserCogProps
) => {
  const { cogActivated, updateSelectedCog, index } = props;

  const toggleCog = useCallback(() => {
    if (cogActivated === false) {
      updateSelectedCog(index);
    } else {
      updateSelectedCog('');
    }
  }, [cogActivated]);

  const inline: CSSProperties = { position: 'relative' };
  const imgInline: CSSProperties = {
    height: '18px',
    width: '18px'
  };

  const cogIcon = props.cogActivated ? cogOnIcon : cogOffIcon;

  return (
    <div style={inline}>
      <button onClick={toggleCog}>
        <img src={cogIcon} style={imgInline} alt="Configure track" />
      </button>
    </div>
  );
};

export default BrowserCog;
