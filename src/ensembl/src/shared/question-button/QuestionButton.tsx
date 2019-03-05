import React from 'react';

import { ReactComponent as QuestionIcon } from './icon_question.svg';

import styles from './QuestionButton.scss';

type Props = {
  onHover: (e: React.MouseEvent) => void;
};

const QuestionButton = (props: Props) => {
  return (
    <div className={styles.questionButton}>
      <QuestionIcon />
    </div>
  );
};

export default QuestionButton;
