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

import styles from './ToolsTopBar.module.css';

type Props = {
  children: ReactNode;
  className?: string;
};

let warningText: string | null = null;

// Comment or uncomment the warning to show or hide it.
warningText = `
Due to scheduled infrastructure maintenance,
the BLAST and VEP tools will be unavailable
from 8:00 AM on November 3rd until the afternoon of November 5th.
`;

const ToolsTopBar = (props: Props) => {
  const componentClasses = classNames(styles.topBar, props.className);

  if (warningText) {
    return (
      <div>
        <div className={styles.warningBanner}>{warningText}</div>
        <div className={componentClasses}>{props.children}</div>
      </div>
    );
  }

  return <div className={componentClasses}>{props.children}</div>;
};

export default ToolsTopBar;
