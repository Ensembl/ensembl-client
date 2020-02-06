import React from 'react';
import { storiesOf } from '@storybook/react';

import QuestionButton, {
  QuestionButtonOption
} from 'src/shared/components/question-button/QuestionButton';

storiesOf('Components|Shared Components/Question button', module)
  .add('default', () => <QuestionButton helpText="This is a hint" />)
  .add('input', () => (
    <QuestionButton
      helpText="This is a hint"
      styleOption={QuestionButtonOption.INPUT}
    />
  ));
