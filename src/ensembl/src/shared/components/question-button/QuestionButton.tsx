import React, { useState } from 'react';
import classNames from 'classnames';

import Tooltip from 'src/shared/components/tooltip/Tooltip';
import { ReactComponent as QuestionIcon } from './icon_question.svg';

import defaultStyles from './QuestionButton.scss';

// Extra styling options based on where the button is located
export enum QuestionButtonOption {
  INPUT = 'in-input-field',
  INLINE = 'inline'
}

type Props = {
  helpText: React.ReactNode;
  styleOption?: QuestionButtonOption;
  classNames?: { [key in QuestionButtonOption]?: string };
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

  const classParams = props.styleOption
    ? [defaultStyles.default, styles[props.styleOption]]
    : defaultStyles.default;

  const className = classNames(classParams);

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
