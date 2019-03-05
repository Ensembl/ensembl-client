import React from 'react';
import { storiesOf } from '@storybook/react';

import { ReactComponent as QuestionButtonIcon } from './icon_tooltip_question.svg';

import QuestionButton from 'src/shared/question-button/QuestionButton';

storiesOf('Components|Shared Components/Question button', module)
  // .add('default', () => <QuestionButton onHover={() => {}} />)
  .add('default', () => (
    <>
      <div>
        <QuestionButton onHover={() => {}} />
      </div>
      <div>
        <QuestionButtonIcon
          style={{ width: '18px', height: '18px', fill: '#33adff' }}
        />
      </div>
    </>
  ));
