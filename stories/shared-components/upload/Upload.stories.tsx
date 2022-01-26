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

import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';

import useFileDrop from 'src/shared/components/upload/hooks/useFileDrop';

import Upload from 'src/shared/components/upload/Upload';
import ShadedTextarea from 'src/shared/components/textarea/ShadedTextarea';
import RadioGroup, {
  type OptionValue
} from 'src/shared/components/radio-group/RadioGroup';

import type {
  FileTransformedToString,
  TransformTo
} from 'src/shared/components/upload/types';

import styles from './Upload.stories.scss';

type DefaultArgs = {
  onChange: (...args: any) => void;
};

const useDisabledDocumentDragover = () => {
  const preventDefault = (event: Event) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('dragover', preventDefault);
    document.addEventListener('drop', preventDefault);

    return () => {
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, []);
};

export const DefaultStory = (args: DefaultArgs) => {
  useDisabledDocumentDragover();
  return (
    <>
      <div className={styles.wrapper}>
        <Upload onUpload={args.onChange} />
      </div>
      <div className={styles.wrapperGrey}>
        <Upload onUpload={args.onChange} />
      </div>
    </>
  );
};

DefaultStory.storyName = 'default';

export const DisabledStory = (args: DefaultArgs) => {
  useDisabledDocumentDragover();
  return (
    <>
      <div className={styles.wrapper}>
        <Upload onUpload={args.onChange} disabled={true} />
      </div>
      <div className={styles.wrapperGrey}>
        <Upload onUpload={args.onChange} disabled={true} />
      </div>
    </>
  );
};

DisabledStory.storyName = 'disabled';

export const InputBoxStory = () => {
  useDisabledDocumentDragover();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const onUpload = ({ content }: FileTransformedToString) => {
    if (!textareaRef.current) {
      return;
    }
    textareaRef.current.value = content as string;
  };

  const { ref, isDraggedOver } = useFileDrop({ onUpload, transformTo: 'text' });

  const inputBoxClasses = classNames(styles.inputBox, {
    [styles.dropZone]: isDraggedOver
  });

  return (
    <>
      <p className={styles.storyDescription}>
        You can wire up a larger component to detect dragging and dropping of
        files. In the example below, a file can be dropped anywhere over the
        input box, not just over the dedicated drop area.
      </p>
      <div className={inputBoxClasses} ref={ref}>
        <div className={styles.textareaContainer}>
          <ShadedTextarea ref={textareaRef} placeholder="Hello stranger" />
        </div>
        <div className={styles.dropZoneContainer}>
          <Upload onUpload={onUpload} transformTo="text" />
        </div>
      </div>
    </>
  );
};

InputBoxStory.storyName = 'part of an input box';

export const ReadFileContentStory = () => {
  const readOptions: Record<TransformTo, string> = {
    arrayBuffer: 'array buffer',
    dataUrl: 'data url',
    text: 'text'
  };
  const [selectedOption, setSelectedOption] = useState<TransformTo>('text');
  const [fileContent, setFileContent] = useState('');
  useDisabledDocumentDragover();

  const onUpload = ({ content }: { content: ArrayBuffer | string | null }) => {
    if (typeof content === 'string') {
      setFileContent(content);
    } else if (content) {
      const bytes = Array.from(new Uint8Array(content));
      // just output a raw bytes string, https://stackoverflow.com/a/62224531/3925302
      const string = bytes.reduce(
        (str, byte) => str + byte.toString(2).padStart(8, '0'),
        ''
      );
      setFileContent(string);
    }
  };

  const onOptionChange = (option: OptionValue) =>
    setSelectedOption(option as TransformTo);

  const options = Object.entries(readOptions).map(([value, label]) => ({
    label,
    value
  }));

  return (
    <>
      <div className={styles.wrapper}>
        <Upload onUpload={onUpload} transformTo={selectedOption} />
      </div>
      <div>
        <p>Read file contents as:</p>
        <RadioGroup
          options={options}
          selectedOption={selectedOption}
          onChange={onOptionChange}
        />
      </div>
      {fileContent && (
        <div>
          <p>File content:</p>
          <div className={styles.fileContent}>{fileContent}</div>
        </div>
      )}
    </>
  );
};

ReadFileContentStory.storyName = 'reading file contents';

// export const CustomLabelStory = (args: DefaultArgs) => (
//   <Wrapper upload={Upload} label={'Upload'} {...args} />
// );

// CustomLabelStory.storyName = 'with custom label';

// export const CallbackWithSingleFileStory = (args: DefaultArgs) => (
//   <Wrapper
//     upload={Upload}
//     callbackWithFiles={true}
//     allowMultiple={false}
//     {...args}
//   />
// );

// CallbackWithSingleFileStory.storyName = 'callback with single file';

// export const CallbackWithMultipleFilesStory = (args: DefaultArgs) => (
//   <Wrapper upload={Upload} callbackWithFiles={true} {...args} />
// );

// CallbackWithMultipleFilesStory.storyName = 'callback with multiple files';

// export const CallbackWithDataUrlStory = (args: DefaultArgs) => (
//   <Wrapper
//     upload={Upload}
//     fileReaderMethod={FileReaderMethod.DATA_URL}
//     {...args}
//   />
// );

// CallbackWithDataUrlStory.storyName = 'callback with data urls';

// export const CallbackWithBinaryStringStory = (args: DefaultArgs) => (
//   <Wrapper
//     upload={Upload}
//     fileReaderMethod={FileReaderMethod.BINARY_STRING}
//     {...args}
//   />
// );

// CallbackWithBinaryStringStory.storyName = 'callback with binary string';

// export const CallbackWithArrayBufferStory = (args: DefaultArgs) => (
//   <Wrapper
//     upload={Upload}
//     fileReaderMethod={FileReaderMethod.ARRAY_BUFFER}
//     {...args}
//   />
// );

// CallbackWithArrayBufferStory.storyName = 'callback with array buffer';

// export const CustomStylingStory = (args: DefaultArgs) => (
//   <Wrapper
//     upload={Upload}
//     label="Upload here"
//     classNames={{
//       default: styles.customizedUpload,
//       active: styles.customizedUploadActive
//     }}
//     {...args}
//   />
// );

// CustomStylingStory.storyName = 'customized upload';

export default {
  title: 'Components/Shared Components/Upload',
  argTypes: { onChange: { action: 'uploaded' } }
};
