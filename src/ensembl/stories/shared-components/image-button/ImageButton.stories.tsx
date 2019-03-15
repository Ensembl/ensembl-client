import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import styles from './ImageButton.stories.scss';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

type Props = {
  buttonStatus: ImageButtonStatus;
};

const ImageButtonParent = (props: Props) => {
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
      <ImageButton
        buttonStatus={buttonStatus}
        description={'enable/disable'}
        image={Eye}
        classNames={styles}
        onClick={toggleImage}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/ImageButton', module)
  .add('default', () => {
    return <ImageButtonParent buttonStatus={ImageButtonStatus.ACTIVE} />;
  })
  .add('disabled', () => {
    return <ImageButtonParent buttonStatus={ImageButtonStatus.DISABLED} />;
  });
