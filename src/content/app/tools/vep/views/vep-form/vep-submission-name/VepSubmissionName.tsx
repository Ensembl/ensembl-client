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

import type { FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getVepSubmissionName } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { updateSubmissionName } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import ShadedInput from 'src/shared/components/input/ShadedInput';

import commonStyles from '../VepForm.module.css';

const VepSubmissionName = () => {
  const submissionName = useAppSelector(getVepSubmissionName) ?? '';
  const dispatch = useAppDispatch();

  const onSubmissionNameChange = (event: FormEvent<HTMLInputElement>) => {
    const newName = event.currentTarget.value;
    dispatch(updateSubmissionName(newName));
  };

  return (
    <div className={commonStyles.submissionName}>
      <label>Submission name</label>
      <ShadedInput
        placeholder="Optional"
        value={submissionName}
        onChange={onSubmissionNameChange}
      />
    </div>
  );
};

export default VepSubmissionName;
