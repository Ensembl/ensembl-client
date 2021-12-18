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

import React, {
  useState,
  useEffect,
  type FormEvent,
  type ClipboardEvent
} from 'react';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import Textarea from 'src/shared/components/textarea/Textarea';
import Upload, { type ReadFile } from 'src/shared/components/upload/Upload';

import { ReactComponent as ResetIcon } from 'static/img/shared/trash.svg';

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
  onRemoveSequence?: (index: number) => void;
};

const BlastInputSequence = (props: Props) => {
  const { index = null, onCommitted, sequence = { value: '' } } = props;
  const [input, setInput] = useState(toFasta(sequence));

  useEffect(() => {
    setInput(toFasta(sequence));
  }, [sequence.header, sequence.value]);

  const onChange = (event: FormEvent<HTMLTextAreaElement>) => {
    setInput(event.currentTarget.value);
  };

  const onPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const input = event.clipboardData.getData('text');
    onCommitted(input, index);
  };

  const onFileDrop = (files: ReadFile[]) => {
    const { content, error } = files[0]; // multiple files aren't allowed
    if (!error && content) {
      onCommitted(content as string, index); // content is expected to be a string because it's Upload's default prop
    }
  };

  const onBlur = () => {
    onCommitted(input, index);
  };

  const onClear = () => {
    props.onRemoveSequence?.(index as number);
  };

  return (
    <div>
      <div className={styles.header}>
        <span>Heading</span>
        {input && (
          <span className={styles.deleteButtonWrapper}>
            <ResetIcon className={styles.deleteButton} onClick={onClear} />
          </span>
        )}
      </div>
      <div className={styles.body}>
        <Textarea
          value={input}
          className={styles.textarea}
          placeholder="Nucleotide of protein sequence in FASTA format"
          onChange={onChange}
          onPaste={onPaste}
          onBlur={onBlur}
          resizable={false}
        />
        <Upload
          label="Click or drag a file here to upload"
          onChange={onFileDrop}
          allowMultiple={false}
        />
      </div>
    </div>
  );
};

export default BlastInputSequence;
