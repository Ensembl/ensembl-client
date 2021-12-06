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

import React, { FormEvent, ClipboardEvent } from 'react';

import Textarea from 'src/shared/components/textarea/Textarea';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

import styles from './BlastInputSequence.scss';

/**
 * Expectations:
 * - user can type a sequence into the field
 * - user can paste a sequence into the field
 * - user can upload a file with one or more sequences
 *
 * What the component needs to be able to do:
 * - receive a sequence object from the parent
 * - accept user's modified input
 *
 * When should the splitting of a single input into multipe inputs happen
 * - on file upload
 * - on paste
 * - on blur?
 */

type Props = {
  index?: number; // 0...n if there are many input elements
  sequence?: ParsedInputSequence;
  onCommitted: (input: string, index: number | null) => void;
};

const BlastInputSequence = (props: Props) => {
  const { index = null, onCommitted } = props;

  const onChange = (event: FormEvent<HTMLTextAreaElement>) => {
    event.currentTarget.value; // TODO: figure out how to handle
  };

  const onPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const input = event.clipboardData.getData('text');
    onCommitted(input, index);
  };

  return (
    <div>
      <div className={styles.header}>Heading</div>
      <div className={styles.body}>
        <Textarea
          className={styles.textarea}
          placeholder="Nucleotide of protein sequence in FASTA format"
          onChange={onChange}
          onPaste={onPaste}
          resizable={false}
        />
      </div>
    </div>
  );
};

export default BlastInputSequence;
