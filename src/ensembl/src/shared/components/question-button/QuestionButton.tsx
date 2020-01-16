import React, { useState, useRef } from 'react';
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
  className?: { [key in QuestionButtonOption]?: string };
};

const QuestionButton = (props: Props) => {
  const [isHovering, setIsHovering] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const className = classNames(
    defaultStyles.default,
    {
      [defaultStyles[props.styleOption as string]]: props.styleOption
    },
    props.className
  );

  return (
    <div
      ref={elementRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <QuestionIcon />
      {isHovering && (
        <Tooltip anchor={elementRef.current} autoAdjust={true}>
          {props.helpText}
        </Tooltip>
      )}
    </div>
  );
};

export default QuestionButton;
