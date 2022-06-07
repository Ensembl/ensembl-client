/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import classNames from 'classnames';

import { useShowTooltip } from 'src/shared/hooks/useShowTooltip';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import QuestionIcon from 'static/icons/icon_question_circle.svg';

import defaultStyles from './QuestionButton.scss';

// Extra styling options based on where the button is located
export enum QuestionButtonOption {
  INPUT = 'in-input-field',
  INLINE = 'inline'
}

type Props = {
  helpText: React.ReactNode;
  styleOption: QuestionButtonOption;
  className?: { [key in QuestionButtonOption]?: string };
};

const QuestionButton = (props: Props) => {
  const { elementRef, onClick, onTooltipCloseSignal, shouldShowTooltip } =
    useShowTooltip();

  const className = classNames(
    defaultStyles.questionButton,
    {
      [defaultStyles[props.styleOption as string]]: props.styleOption
    },
    props.className
  );

  return (
    <div ref={elementRef} className={className} onClick={onClick}>
      <QuestionIcon />
      {shouldShowTooltip && (
        <Tooltip
          anchor={elementRef.current}
          autoAdjust={true}
          onClose={onTooltipCloseSignal}
          delay={0}
        >
          {props.helpText}
        </Tooltip>
      )}
    </div>
  );
};

QuestionButton.defaultProps = {
  styleOption: QuestionButtonOption.INLINE
};

export default QuestionButton;
