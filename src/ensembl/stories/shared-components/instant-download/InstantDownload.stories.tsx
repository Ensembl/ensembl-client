import React from 'react';
import { storiesOf } from '@storybook/react';

import InstantDownloadTranscriptStory from './InstantDownloadTranscript.stories';

storiesOf('Components|Shared Components/InstantDownload', module).add(
  'transcript',
  () => {
    return <InstantDownloadTranscriptStory />;
  }
);
