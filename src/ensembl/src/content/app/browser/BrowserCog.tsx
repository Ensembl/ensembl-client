import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect
} from 'react';
import { connect } from 'react-redux';

import styles from './BrowserCog.scss';

import { updateSelectedCog } from './browserActions';

import cogOnIcon from 'static/img/shared/cog-on.svg';
import cogOffIcon from 'static/img/shared/cog.svg';

import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getDefaultChrLocation
} from './browserSelectors';

type BrowserCogProps = {
  cogActivated: boolean;
  index: number;
  updateSelectedCog: (index: number | null) => void;
};

const BrowserCog: FunctionComponent<BrowserCogProps> = (
  props: BrowserCogProps
) => {
  let { cogActivated, updateSelectedCog, index } = props;

  const toggleCog = useCallback(() => {
    if (cogActivated === false) {
      updateSelectedCog(index);
    } else {
      updateSelectedCog(null);
    }
  }, [cogActivated]);

  let inline = { position: 'relative' };
  let img_inline = {
    height: '24px',
    width: '24px'
  };
  let cogIcon = props.cogActivated ? cogOnIcon : cogOffIcon;
  return (
    <div style={inline}>
      <button onClick={toggleCog}>
        <img src={cogIcon} style={img_inline} alt="Configure track" />
      </button>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedCog
};

const mapStateToProps = (state: RootState): StateProps => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserCog);
