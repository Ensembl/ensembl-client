import React from 'react';
import { storiesOf } from '@storybook/react';

import FeatureLengthAxis from 'src/content/app/entity-viewer/components/feature-length-axis/FeatureLengthAxis';

storiesOf('Components|EntityViewer/FeatureLengthAxis', module).add(
  'default',
  () => <FeatureLengthAxis length={80792} width={600} />
);
