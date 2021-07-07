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
import noop from 'lodash/noop';
import classNames from 'classnames';

import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

import Chevron from 'src/shared/components/chevron/Chevron';

import { InjectedButtonAttributes } from '../helpers/AccordionStore';
import { DivAttributes } from '../helpers/types';

import defaultStyles from '../css/Accordion.scss';

type Props = DivAttributes & {
  extendDefaultStyles: boolean;
  toggleExpanded(): void;
  disabled?: boolean;
};

export const AccordionItemButton = (props: Props) => {
  const {
    className,
    extendDefaultStyles,
    toggleExpanded,
    disabled,
    children,
    ...rest
  } = props;

  let styles = className;

  if (extendDefaultStyles) {
    styles = classNames(
      defaultStyles.accordionButtonDefault,
      { [defaultStyles.accordionButtonDisabled]: props.disabled },
      className
    );
  }

  return (
    <div
      {...rest}
      className={styles}
      onClick={disabled ? noop : toggleExpanded}
      data-accordion-component="AccordionItemButton"
    >
      <div>{children}</div>
      <div>
        <Chevron
          direction={rest['aria-expanded'] ? 'up' : 'down'}
          animate={true}
        />
      </div>
    </div>
  );
};

AccordionItemButton.defaultProps = {
  extendDefaultStyles: true
};

type WrapperProps = { disabled?: boolean } & Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, keyof InjectedButtonAttributes>
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
