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

import { useAppDispatch, useAppSelector } from 'src/store';

import { getSelectedSpecies } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { resetForm } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { DeleteButtonWithLabel } from 'src/shared/components/delete-button/DeleteButton';

type Props = {
  className?: string;
};

/**
 * A selected species is the minimal necessary data of the VEP form that should enable the reset button.
 * Since no other data can be added until a species has been selected, it is also unnecessary
 * to check for the presence for any other data when enabling the button.
 */
const VepFormResetButton = (props: Props) => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const dispatch = useAppDispatch();

  const shouldEnableReset = Boolean(selectedSpecies);

  const onReset = () => {
    dispatch(resetForm());
  };

  return (
    <DeleteButtonWithLabel
      label="Reset"
      onClick={onReset}
      disabled={!shouldEnableReset}
      className={props.className}
    />
  );
};

export default VepFormResetButton;
