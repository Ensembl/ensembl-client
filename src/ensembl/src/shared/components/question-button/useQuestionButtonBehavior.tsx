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

import { useReducer, useEffect } from 'react';
import useHover from 'src/shared/hooks/useHover';

import { TOOLTIP_TIMEOUT } from 'src/shared/components/tooltip/tooltip-constants';

type EventType = 'click' | 'hover';

type State = {
  event: EventType | null;
  isTooltipShown: boolean;
};

type ShowOnHoverAction = {
  type: 'showTooltipOnHover';
};

type ShowOnClickAction = {
  type: 'showTooltipOnClick';
};

type HideAction = {
  type: 'hideTooltip';
};

type Action = ShowOnHoverAction | ShowOnClickAction | HideAction;

const reducer = (_: State, action: Action): State => {
  switch (action.type) {
    case 'showTooltipOnHover':
      return { event: 'hover', isTooltipShown: true };
    case 'showTooltipOnClick':
      return { event: 'click', isTooltipShown: true };
    case 'hideTooltip':
      return initialState;
  }
};

const initialState: State = {
  event: null,
  isTooltipShown: false
};

export const useQuestionButtonBehavior = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  let timeoutId: number | null = null;

  useEffect(() => {
    if (isHovered) {
      timeoutId = window.setTimeout(() => {
        dispatch({ type: 'showTooltipOnHover' });
      }, TOOLTIP_TIMEOUT);
    } else if (state.isTooltipShown && state.event === 'hover') {
      // only hide the tooltip on mouseout if the tooltip was shown due to a hover event
      dispatch({ type: 'hideTooltip' });
    }

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [isHovered]);

  const handleClick = () => {
    cancelTimeout(); // cancel the timer started by hover
    if (!state.isTooltipShown) {
      dispatch({ type: 'showTooltipOnClick' });
    } else {
      dispatch({ type: 'hideTooltip' });
    }
  };

  const cancelTimeout = () => {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = null;
  };

  const onTooltipCloseSignal = () => {
    // tooltip will send a signal to hide it when user click outside of the tooltip
    // or when they start scrolling
    setTimeout(() => {
      // bump this to the next event loop to give the click event time to register and call the click handler
      dispatch({ type: 'hideTooltip' });
    }, 0);
  };

  return {
    questionButtonRef: hoverRef,
    onClick: handleClick,
    onTooltipCloseSignal,
    shouldShowTooltip: state.isTooltipShown
  };
};
