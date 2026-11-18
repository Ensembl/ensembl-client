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

import {
  hasTransSplicingException,
  hasCrossOriginException
} from 'src/content/app/sequence-viewer/utils/exceptionsChecker';

import styles from './ExceptionWarning.module.css';

type Props = {
  exceptions: string[];
};

const ExceptionWarning = (props: Props) => {
  if (hasTransSplicingException(props.exceptions)) {
    return <TransSplicingWarning />;
  }
  if (hasCrossOriginException(props.exceptions)) {
    return <CrossOriginWarning />;
  }
};

const TransSplicingWarning = () => {
  return (
    <div className={styles.warning}>
      Unable to display genomic sequence due to trans-splicing
    </div>
  );
};

const CrossOriginWarning = () => {
  return (
    <div className={styles.warning}>
      Unable to display genomic sequence due to the feature crossing the origin
      of a circular region
    </div>
  );
};

export default ExceptionWarning;
