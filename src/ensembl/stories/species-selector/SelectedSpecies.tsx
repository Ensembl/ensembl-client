import React from 'react';
import { storiesOf } from '@storybook/react';

import SelectedSpecies from 'src/content/app/species-selector/components/selected-species/SelectedSpecies';

storiesOf('Species Selector/Selected Species', module)
  .add('enabled', () => (
    <SelectedSpecies
      name="Mouse C57BL/6NJ"
      assembly="C57BL_6NJ_v1"
      isEnabled
      onEnable={() => {
        console.log('enable');
      }}
      onDisable={() => {
        console.log('disable');
      }}
      onRemove={() => {}}
    />
  ))
  .add('disabled', () => (
    <SelectedSpecies
      name="Mouse C57BL/6NJ"
      assembly="C57BL_6NJ_v1"
      isEnabled={false}
      onEnable={() => {
        console.log('enable');
      }}
      onDisable={() => {
        console.log('disable');
      }}
      onRemove={() => {}}
    />
  ));
