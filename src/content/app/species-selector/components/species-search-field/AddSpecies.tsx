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

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import styles from './SpeciesSearchField.module.css';

export type Props = {
  query: string;
  canAdd: boolean;
  onAdd: () => void;
  onClose: () => void;
};

const AddSpecies = (props: Props) => {
  const { query, canAdd, onAdd, onClose } = props;

  return (
    <div className={styles.grid}>
      <label className={styles.label}>Find a species</label>
      <ShadedInput
        size="large"
        className={styles.input}
        value={query}
        disabled={true}
      />
      <div className={classNames(styles.controls, styles.addSpeciesControls)}>
        <PrimaryButton disabled={!canAdd} onClick={onAdd}>
          Add
        </PrimaryButton>
        <CloseButtonWithLabel onClick={onClose} />
      </div>
    </div>
  );
};

export default AddSpecies;
