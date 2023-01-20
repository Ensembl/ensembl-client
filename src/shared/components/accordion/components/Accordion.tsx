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
import { DivAttributes } from '../helpers/types';
import { Consumer, Provider } from './AccordionContext';
import { UUID } from './ItemContext';
import defaultStyles from '../css/Accordion.scss';
import classNames from 'classnames';

type AccordionProps = Pick<
  DivAttributes,
  Exclude<keyof DivAttributes, 'onChange'>
> & {
  preExpanded?: UUID[];
  allowMultipleExpanded?: boolean;
  allowZeroExpanded?: boolean;
  extendDefaultStyles?: boolean;
  onChange?(args: UUID[]): void;
};

const Accordion = (props: AccordionProps) => {
  const {
    preExpanded,
    allowMultipleExpanded = false,
    allowZeroExpanded = true,
    className,
    extendDefaultStyles = true,
    onChange,
    ...rest
  } = props;

  const renderAccordion = (): JSX.Element => {
    let styles = className;

    if (extendDefaultStyles) {
      styles = classNames(defaultStyles.accordionDefault, className);
    }

    return (
      <div data-accordion-component="Accordion" className={styles} {...rest} />
    );
  };

  return (
    <Provider
      preExpanded={preExpanded}
      allowMultipleExpanded={allowMultipleExpanded}
      allowZeroExpanded={allowZeroExpanded}
      onChange={onChange}
    >
      <Consumer>{renderAccordion}</Consumer>
    </Provider>
  );
};

export default Accordion;
