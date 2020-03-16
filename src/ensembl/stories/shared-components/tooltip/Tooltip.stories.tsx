import React from 'react';
import { storiesOf } from '@storybook/react';

const DefaultTooltipStory = () => {
  return <div>Hello?</div>;
};

const OnScrollTooltipStory = () => {
  return <div>Hello?</div>;
};

storiesOf('Components|Shared Components/Tooltip', module)
  .add('default', () => {
    return <DefaultTooltipStory />;
  })
  .add('scrolling', () => {
    return <OnScrollTooltipStory />;
  });
