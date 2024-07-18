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

import styles from './SpeciesNameParts.module.css';

type Props = {
  is_reference: boolean;
  className?: string;
};

const SpeciesReference = (props: Props) => {
  const { is_reference } = props;

  if (!is_reference) {
    return null;
  }

  const componentClasses = classNames(styles.reference, props.className);

  return (
    <span className={componentClasses} data-part="reference">
      Reference
    </span>
  );
};

export default SpeciesReference;
