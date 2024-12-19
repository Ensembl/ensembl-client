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

import { DivAttributes } from '../helpers/types';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';
import defaultStyles from '../css/Accordion.module.css';
import classNames from 'classnames';

type Props = DivAttributes & {
  extendDefaultStyles?: boolean;
};

const AccordionItemPanel = (props: Props) => {
  const { className, extendDefaultStyles = true, ...rest } = props;

  let styles = className;

  if (extendDefaultStyles) {
    styles = classNames(defaultStyles.accordionPanelDefault, className);
  }

  return (
    <ItemConsumer>
      {({ panelAttributes }: ItemContext) => {
        return (
          <div
            data-accordion-component="AccordionItemPanel"
            {...rest}
            className={styles}
            {...panelAttributes}
          />
        );
      }}
    </ItemConsumer>
  );
};

export default AccordionItemPanel;
