import React from 'react';
import { storiesOf } from '@storybook/react';

import SelectedSpecies from 'src/content/app/species-selector/components/selected-species/SelectedSpecies';

const Container = (props: { children: React.ReactNode }) => (
  <div style={{ padding: '40px' }}>{props.children}</div>
);

storiesOf('Components|Species Selector/Selected Species', module)
  .add('enabled', () => (
    <Container>
      <SelectedSpecies
        name="Mongoose C57BL/6NJ"
        assembly="C57BL_6NJ_v1"
        isEnabled
        onEnable={() => {
          console.log('enable');
        }}
        onDisable={() => {
          console.log('disable');
        }}
        onRemove={() => {
          console.log('remove');
        }}
      />
    </Container>
  ))
  .add('disabled', () => (
    <Container>
      <SelectedSpecies
        name="Mongoose C57BL/6NJ"
        assembly="C57BL_6NJ_v1"
        isEnabled={false}
        onEnable={() => {
          console.log('enable');
        }}
        onDisable={() => {
          console.log('disable');
        }}
        onRemove={() => {
          console.log('remove');
        }}
      />
    </Container>
  ));
