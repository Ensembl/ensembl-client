import React, { useState } from 'react';

import Tooltip, { Position } from 'src/shared/tooltip/Tooltip';
import { ReactComponent as QuestionIcon } from './icon_question.svg';

import styles from './QuestionButton.scss';

type Props = {
  helpText: React.ReactNode;
};

const QuestionButton = (props: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={styles.questionButton}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <QuestionIcon />
      {isHovering && <Tooltip autoAdjust={true}>{props.helpText}</Tooltip>}
    </div>
  );
};

export default QuestionButton;
