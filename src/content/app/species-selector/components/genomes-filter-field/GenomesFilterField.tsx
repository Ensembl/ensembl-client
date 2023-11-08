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

import React, { type FormEvent } from 'react';

import ShadedInput from 'src/shared/components/input/ShadedInput';

const GenomesFilterField = (props: {
  className?: string;
  onFilterChange: (filterQuery: string) => void;
}) => {
  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const filterQuery = event.currentTarget.value;
    props.onFilterChange(filterQuery);
  };

  return (
    <ShadedInput
      placeholder="Filter results"
      type="search"
      size="small"
      onInput={onInput}
      className={props.className}
    />
  );
};

export default GenomesFilterField;
