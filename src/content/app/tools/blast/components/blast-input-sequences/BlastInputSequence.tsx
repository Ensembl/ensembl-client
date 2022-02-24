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
  type ClipboardEvent,
  type FocusEvent
} from 'react';
import classNames from 'classnames';

import { toFasta } from 'src/shared/helpers/formatters/fastaFormatter';
import { isValidSequence } from 'src/content/app/tools/blast/utils/sequenceValidators';

import Textarea from 'src/shared/components/textarea/Textarea';
import {
  Upload,
  useFileDrop,
  type FileTransformedToString
} from 'src/shared/components/upload';
import DeleteButton from 'src/shared/components/delete-button/DeleteButton';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';
import { SequenceType } from 'src/content/app/tools/blast/types/blastSettings';

import styles from './BlastInputSequence.scss';

type Props = {
  index?: number; // 0...n if there are many input elements
  sequence?: ParsedInputSequence;
  sequenceType: SequenceType;
  title?: string;
  onCommitted: (input: string, index: number | null) => void;
  onInput?: (input: string, index: number | null) => void;
  onRemoveSequence?: (index: number | null) => void;
};

const BlastInputSequence = (props: Props) => {
  const {
    index = null,
    onCommitted,
    sequence = { value: '' },
    sequenceType,
    title
  } = props;
  const [input, setInput] = useState(toFasta(sequence));
  const [isFocused, setIsFocused] = useState(false);
  const [forceRenderCount, setForceRenderCount] = useState(0); // A hack. For details, see comment in the bottom of this file
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const onFileDrop = ({ content }: FileTransformedToString) => {
    if (content) {
      onCommitted(content, index);
    }
  };

  const { ref: dropZoneRef, isDraggedOver: isFileOver } = useFileDrop({
    onUpload: onFileDrop,
    transformTo: 'text'
  });

  useEffect(() => {
    setInput(toFasta(sequence));
  }, [sequence.header, sequence.value, forceRenderCount]);

  const forceReadSequenceFromProps = () => {
    setForceRenderCount((count) => count + 1);
  };

  const onChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setInput(value);
    props.onInput?.(value, index);
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
        forceReadSequenceFromProps();
      }, 0);
    }
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = (event: FocusEvent) => {
    const { relatedTarget } = event;
    setIsFocused(false);

    if (relatedTarget !== deleteButtonRef.current) {
      onCommitted(input, index);
      forceReadSequenceFromProps();
    }
  };

  const onClear = () => {
    setInput('');
    props.onRemoveSequence?.(index);
  };

  const isInputValid = input
    ? checkSequenceValidity(input, sequenceType)
    : true; // treat empty input as valid

  const inputBoxClassnames = classNames(styles.inputSequenceBox, {
    [styles.inputSequenceBoxFileOver]: isFileOver
  });

  const textareaClasses = classNames(styles.textarea, {
    [styles.textareaInvalid]: !isInputValid
  });

  return (
    <div className={inputBoxClassnames} ref={dropZoneRef}>
      <div className={styles.header}>
        <span>{title}</span>
        <span className={styles.deleteButtonWrapper}>
          <DeleteButton ref={deleteButtonRef} onClick={onClear} />
        </span>
      </div>
      <div className={styles.body}>
        <Textarea
          ref={textareaRef}
          value={input}
          className={textareaClasses}
          placeholder="Paste plain text or FASTA sequence of at least 5 characters"
          onChange={onChange}
          onPaste={onPaste}
          onFocus={onFocus}
          onBlur={onBlur}
          resizable={false}
        />
        {!input && !isFocused && (
          <Upload transformTo="text" onUpload={onFileDrop} />
        )}
      </div>
    </div>
  );
};

const checkSequenceValidity = (
  sequence: string,
  sequenceType: SequenceType
) => {
  // cleanup the sequence entered into the input box before validating it
  sequence = sequence.replace(/>.*/, '').replaceAll(/\s/g, '');
  return isValidSequence(sequence, sequenceType);
};

export default BlastInputSequence;

/**
 * EXPLANATION OF THE forceRenderCount HACK ABOVE
 *
 * Consider the following scenario:
 *
 * 1. The user pastes the sequence "AAA" into the input box.
 * 2. He then focuses on the input box, presses enter twice (leaving a blank line),
 * and then pastes another sequence (say, "TTT") on a new line.
 *
 * What will happen is the following:
 * - After the first paste event, the "AAA" sequence is communicated to the parent
 *   as committed.
 * - When the second sequence ("TTT") is pasted in the same textarea,
 *   the content of the textarea is committed again.
 * - During the commitment phase, the parent's code will figure out that the textarea
 *   now contains two sequences. So it will split out the second sequence from the input.
 *   Now, there are two committed sequences.
 * - However, the first committed sequence has remained exactly the same as before.
 *   Therefore, the useEffect hook, which runs only when the parent passes a new sequence, won't run
 * - Without the useEffect re-running, the textarea will contain both sequences.
 *   But we want it to only contain the first sequence.
 * - Therefore, we have to nudge the useEffect to re-run, and to reset the textarea value
 *   to the sequence passed with the props.
 */
