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

import styles from './VariantAlleleDirection.module.css';

/**
 * This purpose of this component is to indicate whether the elements of a sequence
 * are replaced (e.g. nucleotides in an SNV or in a substitution),
 * removed (e.g. nucleotides or amino acids in a deletion),
 * or inserted.
 *
 * It does so by displaying an orange arrow pointing upwards or downwards,
 * or by displaying both the upwards and downwards pointing arrows together.
 */

type Props = {
  direction: 'up' | 'down' | 'both';
  className?: string;
};

const VariantAlleleDirection = (props: Props) => {
  const { direction } = props;

  if (direction === 'up' || direction === 'down') {
    const componentClasses = classNames(
      styles.arrow,
      {
        [styles.up]: direction === 'up',
        [styles.down]: direction === 'down'
      },
      props.className
    );
    return <span className={componentClasses} />;
  } else {
    // the direction is "both"
    const upArrowClasses = classNames(styles.arrow, styles.up);
    const downArrowClasses = classNames(styles.arrow, styles.down);
    const containerClasses = classNames(styles.container, props.className);

    return (
      <span className={containerClasses}>
        <span className={downArrowClasses} />
        <span className={upArrowClasses} />
      </span>
    );
  }
};

export default VariantAlleleDirection;
