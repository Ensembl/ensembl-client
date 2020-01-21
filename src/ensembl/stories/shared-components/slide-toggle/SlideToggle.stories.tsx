import React from 'react';
import { storiesOf } from '@storybook/react';

import SlideToggle from 'src/shared/components/slide-toggle/SlideToggle';

storiesOf('Components|Shared Components/SlideToggle', module).add(
  'default',
  () => {
    return (
      <div>
        <SlideToggle isOn={false} onChange={() => console.log('change')} />
      </div>
    );
  }
);
