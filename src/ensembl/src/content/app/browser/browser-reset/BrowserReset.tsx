import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import {
  getBrowserActiveEnsObject,
  isFocusObjectPositionDefault
} from '../browserSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import { changeFocusObject } from '../browserActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

export type BrowserResetProps = {
  focusObject: EnsObject | null;
  changeFocusObject: (objectId: string) => void;
  isActive: boolean;
};

export const BrowserReset: FunctionComponent<BrowserResetProps> = (
  props: BrowserResetProps
) => {
  const { focusObject } = props;
  if (!focusObject) {
    return null;
  }

  const getResetIconStatus = () => {
    return props.isActive ? Status.ACTIVE : Status.DISABLED;
  };

  const handleClick = () => {
    props.changeFocusObject(focusObject.object_id);
  };

  return (
    <div className={styles.resetButton}>
      <ImageButton
        buttonStatus={getResetIconStatus()}
        description={'Reset browser image'}
        image={resetIcon}
        onClick={handleClick}
        classNames={{ disabled: styles.imageButtonDisabled }}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isFocusObjectInDefaultPosition = isFocusObjectPositionDefault(state);
  const isDrawerOpened = getIsDrawerOpened(state);
  return {
    focusObject: getBrowserActiveEnsObject(state),
    isActive: isFocusObjectInDefaultPosition && isDrawerOpened
  };
};

const mapDispatchToProps = {
  changeFocusObject
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserReset);
