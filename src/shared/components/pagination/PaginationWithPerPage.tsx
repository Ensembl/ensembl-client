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

import Pagination, { type PaginationProps } from './Pagination';
import PerPage, {
  defaultPerPageOptions,
  type Props as PerPageProps
} from './PerPage';

import styles from './PaginationWithPerPage.module.css';

/**
 * This component combines, for convenience,
 * the Pagination component and the PerPage component,
 * setting a space between them
 */

type Props = {
  currentPageNumber: PaginationProps['currentPageNumber'];
  lastPageNumber: PaginationProps['lastPageNumber'];
  onPageChange: PaginationProps['onChange'];
  perPageOptions?: PerPageProps['options'];
  perPageValue: PerPageProps['value'];
  onPerPageChange: PerPageProps['onChange'];
  className?: string;
};

const PaginationWithPerPage = (props: Props) => {
  const componentClasses = classNames(styles.container, props.className);

  return (
    <div className={componentClasses}>
      <PerPage
        options={props.perPageOptions ?? defaultPerPageOptions}
        value={props.perPageValue}
        onChange={props.onPerPageChange}
      />
      <Pagination
        currentPageNumber={props.currentPageNumber}
        lastPageNumber={props.lastPageNumber}
        onChange={props.onPageChange}
      />
    </div>
  );
};

export { defaultPerPageOptions, defaultPerPageValue } from './PerPage';
export default PaginationWithPerPage;
