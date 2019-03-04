import React from 'react';
import { storiesOf } from '@storybook/react';

import Input from 'src/shared/input/Input';

storiesOf('Components|Shared Components/Input', module).add('default', () => {
  return (
    <div>
      <Input onChange={(value: string) => console.log('value:', value)} />
    </div>
  );
});
