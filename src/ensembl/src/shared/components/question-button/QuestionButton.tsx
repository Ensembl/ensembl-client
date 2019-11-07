import React, { useState } from 'react';
import classNames from 'classnames';

import Tooltip from 'src/shared/components/tooltip/Tooltip';
import { ReactComponent as QuestionIcon } from './icon_question.svg';

import styles from './QuestionButton.scss';

type Props = {
  helpText: React.ReactNode;
  style: string;
};

const QuestionButton = (props: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const className = classNames(styles.default, styles[props.style]);

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <QuestionIcon />
      {isHovering && <Tooltip autoAdjust={true}>{props.helpText}</Tooltip>}
    </div>
  );
};

export default QuestionButton;
