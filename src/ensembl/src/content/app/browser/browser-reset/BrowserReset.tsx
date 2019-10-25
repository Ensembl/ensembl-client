import React, { FunctionComponent } from 'react';

import { ReactComponent as resetIcon } from 'static/img/browser/track-reset.svg';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import styles from './BrowserReset.scss';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { Status } from 'src/shared/types/status';

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
    <dd className={styles.resetButton}>
      <div className={styles.imageWrapper}>
        <ImageButton
          buttonStatus={getResetIconStatus()}
          description={'Reset browser image'}
          image={resetIcon}
          onClick={handleClick}
          classNames={{ disabled: styles.imageButtonDisabled }}
        />
      </div>
    </dd>
  );
};

export default BrowserReset;
