import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import EyeToggleButton from 'src/shared/eye-toggle-button/EyeToggleButton';

const EyeToggleButtonParent = () => {
  const [eyeStatus, setVisible] = useState(true);

  const toggleEye = () => setVisible(!eyeStatus);

  const styles = {
    margin: '10px'
  };

  return (
    <div style={styles}>
      <EyeToggleButton
        iconStatus={eyeStatus}
        description={'enable/disable'}
        onClick={toggleEye}
      />
    </div>
  );
};

storiesOf('Components|Shared Components/EyeToggleButton', module).add(
  'default',
  () => {
    return <EyeToggleButtonParent />;
  }
);
