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

import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './VerticallyCenteredCellContent.module.css';

/**
 * The purpose of this component is to keep table cell content
 * vertically centred.
 *
 * Its typical use case is to wrap an element whose display
 * is inline-block (an image, an icon, a button, etc.), or inline-flex
 */

type Props = {
  children: ReactNode;
  centerHorizontally?: boolean;
  className?: string;
};

const VerticallyCenteredCellContent = (props: Props) => {
  const componentClasses = classNames(
    styles.verticallyCentered,
    props.className,
    {
      [styles.horizontallyCentered]: props.centerHorizontally ?? true
    }
  );

  return <div className={componentClasses}>{props.children}</div>;
};

export default VerticallyCenteredCellContent;
