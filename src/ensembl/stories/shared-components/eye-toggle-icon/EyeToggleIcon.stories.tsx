import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import EyeToggleIcon from 'src/shared/eye-toggle-icon/EyeToggleIcon';

type Props = {
  eyeStatus: string;
};

const EyeToggleIconParent = (props: Props) => {
  const [eyeStatus, setVisible] = useState('on');

  const toggleEye = () => {
    if (eyeStatus === 'on') {
      setVisible('off');
      return;
    }
    setVisible('on');
  };

  const styles = {
    margin: '10px'
  };

  return (
    <div style={styles}>
      <EyeToggleIcon
        iconStatus={props.eyeStatus}
        description={'enable/disable'}
        callbackFunction={toggleEye}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/EyeToggleIcon', module)
  .add('On', () => {
    return <EyeToggleIconParent eyeStatus={'on'} />;
  })
  .add('Off', () => {
    return <EyeToggleIconParent eyeStatus={'off'} />;
  });
