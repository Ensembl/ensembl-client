import React, { useState } from 'react';
import classNames from 'classnames';

import Tooltip from 'src/shared/components/tooltip/Tooltip';
import { ReactComponent as QuestionIcon } from './icon_question.svg';

import defaultStyles from './QuestionButton.scss';

export enum QuestionButtonStyle {
  SMALL = 'small'
}

type Props = {
  helpText: React.ReactNode;
  classNames?: { [key in QuestionButtonStyle]?: string };
  style: QuestionButtonStyle;
};

const QuestionButton = (props: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const className = classNames(defaultStyles.default, styles[props.style]);

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
