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

import noop from 'lodash/noop';
import classNames from 'classnames';

import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

import Chevron from 'src/shared/components/chevron/Chevron';

import { InjectedButtonAttributes } from '../helpers/AccordionStore';
import { DivAttributes } from '../helpers/types';

import defaultStyles from '../css/Accordion.module.css';

type Props = Pick<DivAttributes, Exclude<keyof DivAttributes, 'onToggle'>> & {
  extendDefaultStyles?: boolean;
  toggleExpanded: () => void;
  disabled?: boolean;
  onToggle?: (isExpanded: boolean) => void;
};

export const AccordionItemButton = (props: Props) => {
  const {
    className,
    extendDefaultStyles = true,
    toggleExpanded,
    disabled,
    onToggle,
    children,
    ...rest
  } = props;

  const isExpanded = Boolean(rest['aria-expanded']);

  let styles = className;

  if (extendDefaultStyles) {
    styles = classNames(
      defaultStyles.accordionButtonDefault,
      { [defaultStyles.accordionButtonDisabled]: props.disabled },
      className
    );
  }

  const onClick = () => {
    if (onToggle) {
      onToggle(!isExpanded);
    }

    toggleExpanded();
  };

  return (
    <div
      {...rest}
      className={styles}
      onClick={disabled ? noop : onClick}
      data-accordion-component="AccordionItemButton"
    >
      <div>{children}</div>
      {!disabled && (
        <div>
          <Chevron direction={isExpanded ? 'up' : 'down'} animate={true} />
        </div>
      )}
    </div>
  );
};

type WrapperProps = {
  disabled?: boolean;
  onToggle?: (isExpanded: boolean) => void;
} & Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, keyof InjectedButtonAttributes | 'onToggle'>
>;

const AccordionItemButtonWrapper = (props: WrapperProps) => (
  <ItemConsumer>
    {(itemContext: ItemContext) => {
      const { toggleExpanded, buttonAttributes } = itemContext;

      return (
        <AccordionItemButton
          toggleExpanded={toggleExpanded}
          {...props}
          {...buttonAttributes}
        />
      );
    }}
  </ItemConsumer>
);

export default AccordionItemButtonWrapper;
