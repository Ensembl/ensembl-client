import React from 'react';

import LoadingButton from 'src/shared/components/loading-button/LoadingButton';

export default {
  title: 'Components/Shared Components/LoadingButton'
};

const longTask = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('task completed')
  }, 100);
});

export const LoadingButtonStory = () => (
  <div >
    <LoadingButton onClick={longTask} onSuccess={(x: unknown) => console.log('on success!', x)}>
      Press me!
    </LoadingButton>
  </div>
);

LoadingButtonStory.storyName = 'default';
