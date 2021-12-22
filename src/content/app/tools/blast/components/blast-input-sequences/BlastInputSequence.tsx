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
  useRef,
  type FormEvent,
  type ClipboardEvent
} from 'react';
import classNames from 'classnames';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';

import Textarea from 'src/shared/components/textarea/Textarea';
import Upload, { type ReadFile } from 'src/shared/components/upload/Upload';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';

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
  title?: string;
  onCommitted: (input: string, index: number | null) => void;
  onRemoveSequence?: (index: number | null) => void;
};

const BlastInputSequence = (props: Props) => {
  const { index = null, onCommitted, sequence = { value: '' }, title } = props;
  const [input, setInput] = useState(toFasta(sequence));
  const canSubmit = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setInput(toFasta(sequence));
  }, [sequence.header, sequence.value]);

  const onChange = (event: FormEvent<HTMLTextAreaElement>) => {
    setInput(event.currentTarget.value);
  };

  const onPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (!input) {
      const pasted = event.clipboardData.getData('text');
      onCommitted(pasted, index);
    } else {
      // the user is modifying their input by pasting something inside of it;
      // we can't just commit only what's been pasted;
      // we have to read the whole input back from the textarea
      setTimeout(() => {
        const input = textareaRef.current?.value as string;
        onCommitted(input, index);
      }, 0);
    }
  };

  const onFileDrop = (files: ReadFile[]) => {
    const { content, error } = files[0]; // multiple files aren't allowed
    if (!error && content) {
      onCommitted(content as string, index); // content is expected to be a string because it's Upload's default prop
    }
  };

  const onBlur = () => {
    if (canSubmit.current) {
      onCommitted(input, index);
    }
  };

  const onClear = () => {
    canSubmit.current = false; // lock against the sequence submission on blur
    setInput('');
    sequence.value && props.onRemoveSequence?.(index);
    setTimeout(() => (canSubmit.current = true), 0);
  };

  const textareaClasses = classNames(styles.textarea);

  return (
    <div className={styles.inputSequenceBox}>
      <div className={styles.header}>
        <span>{title}</span>
        {input && (
          <span className={styles.deleteButtonWrapper}>
            <DeleteButton onMouseDown={onClear} onTouchStart={onClear} />
          </span>
        )}
      </div>
      <div className={styles.body}>
        <Textarea
          ref={textareaRef}
          value={input}
          className={textareaClasses}
          placeholder="Paste a nucleotide of protein sequence"
          onChange={onChange}
          onPaste={onPaste}
          onBlur={onBlur}
          resizable={false}
        />
        {!input && (
          <Upload
            label="Click or drag a file here to upload"
            onChange={onFileDrop}
            allowMultiple={false}
          />
        )}
      </div>
    </div>
  );
};

export default BlastInputSequence;
