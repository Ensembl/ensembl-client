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
import { useSelector } from 'react-redux';

import useBlastAPI from 'src/content/app/tools/blast/hooks/useBlastAPI';
import { PrimaryButton } from 'src/shared/components/button/Button';

import useBlastInputSequences from 'src/content/app/tools/blast/components/blast-input-sequences/useBlastInputSequences';
import { getSelectedSpeciesIds } from 'src/content/app/tools/blast/state/blast-form/blastFormSelectors';
import { isBlastFormValid } from 'src/content/app/tools/blast/utils/blastFormValidator';
import { getBlastFormData } from '../../state/blast-form/blastFormSelectors';

const BlastJobSubmit = () => {
  const { submitBlastJob } = useBlastAPI();

  const { sequences } = useBlastInputSequences();
  const selectedSpecies = useSelector(getSelectedSpeciesIds);

  const isDisabled = !isBlastFormValid(selectedSpecies, sequences);

  const blastFormData = useSelector(getBlastFormData);

  const onBlastSubmit = async () => {
    const result = await submitBlastJob(blastFormData);

    if (!result) {
      return;
    }

    const resultPageUrl = `https://wwwdev.ebi.ac.uk/Tools/services/web/toolresult.ebi?jobId=${result.jobIds[0]}`;

    const resultTab = window.open(resultPageUrl, '_blank');
    if (resultTab !== null) {
      resultTab.focus();
    }
  };

  return (
    <PrimaryButton onClick={onBlastSubmit} isDisabled={isDisabled}>
      Run
    </PrimaryButton>
  );
};

export default BlastJobSubmit;
