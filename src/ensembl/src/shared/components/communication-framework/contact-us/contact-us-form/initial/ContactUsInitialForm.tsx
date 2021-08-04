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

import React, { useState, useReducer, useCallback, useRef } from 'react';
import noop from 'lodash/noop';

import { submitForm } from '../submitForm';

import SubmissionSuccess from '../submission-success/SubmissionSuccess';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import ShadedTextarea from 'src/shared/components/textarea/ShadedTextarea';
import Upload from 'src/shared/components/upload/Upload';
import UploadedFile from 'src/shared/components/uploaded-file/UploadedFile';
import { PrimaryButton } from 'src/shared/components/button/Button';

import commonStyles from '../ContactUsForm.scss';

type State = {
  name: string;
  email: string;
  subject: string;
  message: string;
  files: File[];
};

const initialState: State = {
  name: '',
  email: '',
  subject: '',
  message: '',
  files: []
};

type UpdateNameAction = {
  type: 'update-name';
  payload: string;
};

type UpdateEmailAction = {
  type: 'update-email';
  payload: string;
};

type UpdateSubjectAction = {
  type: 'update-subject';
  payload: string;
};

type UpdateMessageAction = {
  type: 'update-message';
  payload: string;
};

type AddFileAction = {
  type: 'add-file';
  payload: File;
};

type RemoveFileAction = {
  type: 'remove-file';
  payload: number; // index of the file in the array of files
};

type Action =
  | UpdateNameAction
  | UpdateEmailAction
  | UpdateSubjectAction
  | UpdateMessageAction
  | AddFileAction
  | RemoveFileAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'update-name':
      return { ...state, name: action.payload };
    case 'update-email':
      return { ...state, email: action.payload };
    case 'update-subject':
      return { ...state, subject: action.payload };
    case 'update-message':
      return { ...state, message: action.payload };
    case 'add-file':
      return { ...state, files: [...state.files, action.payload] };
    case 'remove-file':
      const newFiles = [...state.files];
      newFiles.splice(action.payload, 1);
      return { ...state, files: newFiles };
    default:
      return state;
  }
};

const ContactUsInitialForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stateRef = useRef<typeof state>();
  stateRef.current = state;

  const onNameChange = useCallback((value: string) => {
    dispatch({ type: 'update-name', payload: value });
  }, []);

  const onEmailChange = useCallback((value: string) => {
    dispatch({ type: 'update-email', payload: value });
  }, []);

  const onSubjectChange = useCallback((value: string) => {
    dispatch({ type: 'update-subject', payload: value });
  }, []);

  const onMessageChange = useCallback((value: string) => {
    dispatch({ type: 'update-message', payload: value });
  }, []);

  const onFileChange = useCallback((fileList: FileList) => {
    for (const file of fileList) {
      dispatch({ type: 'add-file', payload: file });
    }
  }, []);

  const deleteFile = (index: number) => {
    dispatch({ type: 'remove-file', payload: index });
  };

  const handleSubmit = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    stateRef.current && submitForm(stateRef.current);
    setIsSubmitted(true);
  }, []);

  const isFormValid = validate(state);

  if (isSubmitted) {
    return <SubmissionSuccess />;
  }

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.grid}>
        <p className={commonStyles.advisory}>
          <span>All fields are required</span>
          <span>
            The size of your combined attachments should be no more than 10 MB
          </span>
        </p>
      </div>
      <form
        className={commonStyles.grid}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name" className={commonStyles.label}>
          Your name
        </label>
        <ShadedInput id="name" value={state.name} onChange={onNameChange} />

        <label htmlFor="email" className={commonStyles.label}>
          Your email
        </label>
        <ShadedInput id="email" value={state.email} onChange={onEmailChange} />

        <label htmlFor="subject" className={commonStyles.label}>
          Subject
        </label>
        <ShadedInput
          id="subject"
          value={state.subject}
          onChange={onSubjectChange}
        />

        <label htmlFor="message" className={commonStyles.label}>
          Message
        </label>
        <ShadedTextarea
          id="message"
          value={state.message}
          onChange={onMessageChange}
          className={commonStyles.textarea}
        />

        <div className={commonStyles.upload}>
          {state.files.map((file, index) => (
            <UploadedFile
              key={index}
              file={file}
              onDelete={() => deleteFile(index)}
              classNames={{ wrapper: commonStyles.uploadedFile }}
            />
          ))}
          <Upload
            label="Click or drag a file here to upload"
            callbackWithFiles={true}
            disabled={!isFormValid}
            onChange={onFileChange}
          />
        </div>

        <div className={commonStyles.submit}>
          {exceedsAttachmentsSizeLimit(state) && (
            <span className={commonStyles.errorText}>
              Attachment(s) exceed 10 MB
            </span>
          )}

          <PrimaryButton type="submit" isDisabled={!isFormValid} onClick={noop}>
            Submit
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

const validate = (formState: State) => {
  return (
    areMandatoryFieldsFilled(formState) &&
    !exceedsAttachmentsSizeLimit(formState)
  );
};

const areMandatoryFieldsFilled = (formState: State) => {
  return (['name', 'email', 'subject', 'message'] as const).every(
    (field) => formState[field]
  );
};

const getTotalFilesSize = (formState: State) => {
  return formState.files.reduce((sum, file) => sum + file.size, 0);
};

const exceedsAttachmentsSizeLimit = (formState: State) => {
  const attachmentsSizeLimit = 10e6; // 10 MB according to SI units (where 1 megabyte is exactly 1 million bytes)
  const totalFileSize = getTotalFilesSize(formState);
  return totalFileSize > attachmentsSizeLimit;
};

export default ContactUsInitialForm;
