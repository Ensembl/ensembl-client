import React from 'react';
import { storiesOf } from '@storybook/react';

import StrainSelector from 'src/content/app/species-selector/components/strain-selector/StrainSelector';

export const strains = [
  {
    name: 'Mouse GRCm38.6',
    isSelected: true
  },
  {
    name: 'Mouse 129S1/SvimJ',
    isSelected: false
  },
  {
    name: 'Mouse A/J',
    isSelected: false
  },
  {
    name: 'Mouse AKR/J',
    isSelected: true
  }
];

storiesOf('Components|Species Selector/Strain Selector', module).add(
  'default',
  () => (
    <div style={{ padding: '50px' }}>
      <StrainSelector
        strains={strains}
        onSelect={(name) => console.log(`selected strain ${name}`)}
      />
    </div>
  )
);
