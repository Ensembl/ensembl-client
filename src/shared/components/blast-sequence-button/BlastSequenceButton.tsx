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
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useBlastForm from 'src/content/app/tools/blast/hooks/useBlastForm';

import { ImageButton } from 'src/shared/components/image-button/ImageButton';
import { BlastIcon } from 'src/shared/components/app-icon';

import { Status } from 'src/shared/types/status';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import type { SequenceType } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastSequenceButton.scss';

type Props = {
  label?: string;
  species: Species;
  sequence?: string; // if the sequence isn't provided, the button will be disabled
  header?: string;
  sequenceType: SequenceType;
  className?: string;
};

const BlastSequenceButton = (props: Props) => {
  const defaultLabel = 'Blast whole sequence';
  const {
    label = defaultLabel,
    species,
    header,
    sequence,
    sequenceType,
    className
  } = props;
  const navigate = useNavigate();

  const { setSequenceForGenome } = useBlastForm();

  const onClick = () => {
    if (!sequence) {
      return;
    }

    setSequenceForGenome({
      sequence: { header, value: sequence },
      species,
      sequenceType
    });

    navigate(urlFor.blastForm());
  };

  const isButtonEnabled = Boolean(sequence);
  const componentClasses = classNames(styles.container, className);
  const buttonClasses = classNames(
    styles.button,
    isButtonEnabled ? styles.buttonEnabled : styles.buttonDisabled
  );
  const imageButtonProps = !sequence
    ? ({
        status: Status.DEFAULT
      } as const)
    : {};

  return (
    <div className={componentClasses}>
      <span className={styles.label}>{label}</span>
      <ImageButton
        image={BlastIcon}
        description={label}
        onClick={onClick}
        className={buttonClasses}
        {...imageButtonProps}
      />
    </div>
  );
};

export default BlastSequenceButton;
