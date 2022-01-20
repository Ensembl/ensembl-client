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

import { Provider as ItemProvider, UUID } from './ItemContext';
import classNames from 'classnames';
import { generateId } from 'src/shared/helpers/generateId';

import defaultStyles from '../css/Accordion.scss';

type Props = DivAttributes & {
  extendDefaultStyles: boolean;
  uuid?: UUID;
};

const AccordionItem = (props: Props) => {
  const instanceUuid: UUID = generateId();

  const {
    uuid = instanceUuid,
    extendDefaultStyles,
    className,
    ...rest
  } = props;

  let styles = className;

  if (extendDefaultStyles) {
    styles = classNames(defaultStyles.accordionItemDefault, className);
  }

  return (
    <ItemProvider uuid={uuid}>
      <div
        data-accordion-component="AccordionItem"
        {...rest}
        className={styles}
      />
    </ItemProvider>
  );
};

AccordionItem.defaultProps = {
  extendDefaultStyles: true
};

export default AccordionItem;