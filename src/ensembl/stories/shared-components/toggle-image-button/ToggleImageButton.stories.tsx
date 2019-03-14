import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import styles from 'src/shared/toggle-image-button/ToggleImageButton.scss';
import ToggleImageButton, {
  ImageButtonStatus
} from 'src/shared/toggle-image-button/ToggleImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
};

const ToggleImageButtonParent = (props: Props) => {
  const [buttonStatus, setVisible] = useState(props.buttonStatus);

  const toggleImage = () => {
    if (buttonStatus === ImageButtonStatus.ACTIVE) {
      return setVisible(ImageButtonStatus.INACTIVE);
    }
    setVisible(ImageButtonStatus.ACTIVE);
  };

  const containerStyles = {
    height: '20px',
    margin: '10px',
    width: '20px'
  };

  return (
    <div style={containerStyles}>
      <ToggleImageButton
        buttonStatus={buttonStatus}
        description={'enable/disable'}
        imageFile={Eye}
        imageStyles={styles}
        onClick={toggleImage}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/ToggleImageButton', module)
  .add('default', () => {
    return <ToggleImageButtonParent buttonStatus={ImageButtonStatus.ACTIVE} />;
  })
  .add('disabled', () => {
    return (
      <ToggleImageButtonParent buttonStatus={ImageButtonStatus.DISABLED} />
    );
  });
