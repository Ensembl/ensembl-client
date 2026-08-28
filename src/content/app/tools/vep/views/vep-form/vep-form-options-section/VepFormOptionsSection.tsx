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

import { useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormInputCommittedFlag,
  getVepFormParameters
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { updateParameters } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { useVepFormConfigQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import VepFormOptionsPanel from './vep-form-options-panel/VepFormOptionsPanel';
import {
  allPanelsSelectionUpdates,
  areAllPanelsFullySelected
} from './vep-form-options-panel/panelSelectionUpdates';
import { CircleLoader } from 'src/shared/components/loader';

import type { FormPanel } from 'src/content/app/tools/vep/types/vepFormConfig';

import styles from './VepFormOptionsSection.module.css';

const VepFormOptionsSection = () => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const isVariantsInputCommitted = useAppSelector(getVepFormInputCommittedFlag);

  const { currentData: formConfig, isFetching } = useVepFormConfigQuery(
    {
      genome_id: selectedSpecies?.genome_id ?? ''
    },
    {
      skip: !selectedSpecies
    }
  );

  if (isFetching && isVariantsInputCommitted) {
    return (
      <div className={styles.container}>
        <CircleLoader />
      </div>
    );
  }

  if (selectedSpecies && isVariantsInputCommitted && !formConfig) {
    return <div>The form is in an invalid state. Please clear the form.</div>;
  }

  if (selectedSpecies && isVariantsInputCommitted && formConfig) {
    return <OptionsSection panels={formConfig.panels} />;
  }
};

const OptionsSection = (props: { panels: FormPanel[] }) => {
  const { panels } = props;
  const dispatch = useAppDispatch();
  const formParameters = useAppSelector(getVepFormParameters);

  // Derived, not held: unticking one option by hand must flip the toggle back,
  // or it would offer to disable a set that is no longer all on.
  const allSelected = useMemo(
    () => areAllPanelsFullySelected(panels, formParameters),
    [panels, formParameters]
  );

  // Bumped on each click so the panels can tell a fresh command from a
  // re-render (see VepFormOptionsPanel's `expandCommand`).
  const [expandCommand, setExpandCommand] = useState<{
    expanded: boolean;
    nonce: number;
  }>();

  const toggleAll = () => {
    const enabling = !allSelected;
    dispatch(updateParameters(allPanelsSelectionUpdates(panels, enabling)));
    setExpandCommand((previous) => ({
      expanded: enabling,
      nonce: (previous?.nonce ?? 0) + 1
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <span>Job options</span>
        <button
          type="button"
          className={styles.enableAllButton}
          onClick={toggleAll}
        >
          {allSelected ? 'Disable all options' : 'Enable all default options'}
        </button>
      </div>
      {panels.map((panel) => (
        <VepFormOptionsPanel
          key={panel.id}
          panel={panel}
          expandCommand={expandCommand}
        />
      ))}
    </div>
  );
};

export default VepFormOptionsSection;
