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
import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useBlastInputSequences from 'src/content/app/tools/blast/components/blast-input-sequences/useBlastInputSequences';

import { useAppDispatch } from 'src/store';

import {
  addSelectedSpecies,
  clearBlastForm
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

import { ImageButton } from 'src/shared/components/image-button/ImageButton';
import { BlastIcon } from 'src/shared/components/app-icon';

import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { SequenceType } from 'src/content/app/tools/blast/types/blastSettings';

type Props = {
  species: Species;
  sequence?: string; // if the sequuence isn't provided, the button will be disabled
  sequenceType: SequenceType;
};

const BlastSequenceButton = (props: Props) => {
  const { species, sequence } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { updateSequences } = useBlastInputSequences();

  const onClick = () => {
    if (!sequence) {
      return;
    }

    dispatch(clearBlastForm());
    updateSequences([{ value: sequence }]);
    dispatch(addSelectedSpecies(species));

    navigate(urlFor.blastForm());
  };

  return (
    <div>
      <span>Blast whole sequence</span>
      <ImageButton
        image={BlastIcon}
        description="Blast whole sequuence"
        onClick={onClick}
      />
    </div>
  );
};

export default BlastSequenceButton;
