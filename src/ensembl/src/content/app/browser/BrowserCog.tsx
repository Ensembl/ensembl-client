import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect
} from 'react';
import { connect } from 'react-redux';

import styles from './BrowserCog.scss';

import cogIcon from 'static/img/shared/cog.svg';

import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getDefaultChrLocation
} from './browserSelectors';

type BrowserCogProps = {};

const BrowserCog: FunctionComponent<BrowserCogProps> = () => {
  let inline = {};
  let img_inline = {
    height: '24px',
    width: '24px'
  };
  return (
    <div style={inline}>
      <button>
        <img src={cogIcon} style={img_inline} alt="Configure track" />
      </button>
    </div>
  );
};

const mapDispatchToProps: DispatchProps = {};

const mapStateToProps = (state: RootState): StateProps => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserCog);
