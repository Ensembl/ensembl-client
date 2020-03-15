import React from 'react';
import { connect } from 'react-redux';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import {
  isFocusObjectPositionDefault
} from '../browserSelectors';

import { changeFocusObject } from '../browserActions';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';
import {
  ToggleButton as ToolboxToggleButton
} from 'src/shared/components/toolbox';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';

import { RootState } from 'src/store';

import styles from './Zmenu.scss';

type Props = {
  featureId: string;
  isInDefaultPosition: boolean;
}

const ZmenuAppLinks = (props: Props) => {

  if (!isEnvironment([
    Environment.DEVELOPMENT,
    Environment.INTERNAL
  ])) {
    return null;
  }

  // FIXME: the row of buttons should be shown only for the gene feature.
  // Change this temporary hack to using the "type" field when genome browser
  // starts reporting the type of clicked features
  if (!props.featureId.includes(':gene:')) {
    return null;
  }

  return (
    <div className={styles.zmenuAppLinks}>
      <span>View in</span>
      <ImageButton
        className={styles.zmenuAppButton}
        image={BrowserIcon}
      />
      <ImageButton
        className={styles.zmenuAppButton}
        image={EntityViewerIcon}
      />
      <ToolboxToggleButton
        className={styles.zmenuToggleFooter}
        openElement={<span>Download</span>}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isInDefaultPosition: isFocusObjectPositionDefault(state)
});

const mapDispatchToProps = {
  changeFocusObject
};

export default connect(mapStateToProps)(ZmenuAppLinks);
