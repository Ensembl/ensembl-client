import React from 'react';
import { storiesOf } from '@storybook/react';

import SpeciesSelector from 'src/content/app/species-selector/SpeciesSelector';

storiesOf('Button', module).add('Species selector', () => <SpeciesSelector />);
