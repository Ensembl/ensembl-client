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
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent
} from 'react';
import classNames from 'classnames';

import ChevronButton from 'src/shared/components/chevron-button/ChevronButton';
import Input from 'src/shared/components/input/Input';

import styles from './Pagination.module.css';

export type PaginationProps = {
  currentPageNumber: number;
  lastPageNumber: number;
  onChange: (pageNumber: number) => void;
  className?: string;
};

const Pagination = (props: PaginationProps) => {
  const { currentPageNumber: pageNumberFromProps, lastPageNumber } = props;
  const [pageNumber, setPageNumber] = useState<string | number>(
    pageNumberFromProps
  );
  const [previousPageNumberFromProps, setPreviousPageNumberFromProps] =
    useState(pageNumberFromProps);

  if (pageNumberFromProps !== previousPageNumberFromProps) {
    setPageNumber(pageNumberFromProps);
    setPreviousPageNumberFromProps(pageNumberFromProps);
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageNumber(event.target.value);
  };

  const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const parsedInputValue = Number(inputValue);
    if (!isValidPageNumber(parsedInputValue)) {
      setPageNumber(pageNumberFromProps);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedPageNumber = Number(pageNumber);

    if (!isValidPageNumber(parsedPageNumber)) {
      return;
    }

    props.onChange(parsedPageNumber);
  };

  const isValidPageNumber = (value: number) => {
    return !isNaN(value) && value <= lastPageNumber && value > 0;
  };

  const componentClasses = classNames(styles.pagination, props.className);

  return (
    <div className={componentClasses}>
      <ChevronButton
        direction="left"
        className={styles.showHide}
        disabled={pageNumberFromProps === 1}
        onClick={() => props.onChange(pageNumberFromProps - 1)}
      />
      <form onSubmit={onSubmit}>
        <Input
          value={pageNumber}
          onChange={onChange}
          onBlur={onInputBlur}
          className={styles.inputBox}
          disabled={lastPageNumber === 1}
        />
      </form>
      of {lastPageNumber}
      <ChevronButton
        direction="right"
        className={styles.showHide}
        disabled={pageNumberFromProps === lastPageNumber}
        onClick={() => props.onChange(pageNumberFromProps + 1)}
      />
    </div>
  );
};

export default Pagination;
