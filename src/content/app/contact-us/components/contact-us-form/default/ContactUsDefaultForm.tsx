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

import {
  useState,
  useReducer,
  useCallback,
  useRef,
  type InputEvent,
  type SubmitEvent
} from 'react';
import classNames from 'classnames';

import { submitForm } from '../submitForm';
import useSavedForm from '../hooks/useSavedForm';

import SubmissionSuccess from '../submission-success/SubmissionSuccess';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import ShadedTextarea from 'src/shared/components/textarea/ShadedTextarea';
import { Upload, useFileDrop } from 'src/shared/components/upload';
import UploadedFile from 'src/shared/components/uploaded-file/UploadedFile';
import SubmitSlider from '../submit-slider/SubmitSlider';
import { ControlledLoadingButton } from 'src/shared/components/loading-button';

import { LoadingState } from 'src/shared/types/loading-state';

import commonStyles from '../ContactUsForm.module.css';

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

type ReplaceStateAction = {
  type: 'replace-state';
  payload: State;
};

type ClearFormAction = {
  type: 'clear-form';
};

type Action =
  | UpdateNameAction
  | UpdateEmailAction
  | UpdateSubjectAction
  | UpdateMessageAction
  | AddFileAction
  | RemoveFileAction
  | ReplaceStateAction
  | ClearFormAction;

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
    case 'remove-file': {
      const newFiles = [...state.files];
      newFiles.splice(action.payload, 1);
      return { ...state, files: newFiles };
    }
    case 'replace-state':
      return action.payload;
    case 'clear-form':
      return initialState;
    default:
      return state;
  }
};

const FORM_NAME = 'contact-us-general';

const ContactUsDefaultForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
  const [emailFieldValid, setEmailFieldValid] = useState(true);
  const [emailFieldFocussed, setEmailFieldFocussed] = useState(false);
  const [submissionState, setSubmissionState] = useState<LoadingState>(
    LoadingState.NOT_REQUESTED
  );

  const emailFieldRef = useRef<HTMLInputElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const isFormValid = validate(state) && emailFieldValid;

  const onFileChange = (files: File[]) => {
    if (!isFormValid) {
      return;
    }
    for (const file of files) {
      dispatch({ type: 'add-file', payload: file });
    }
  };

  // wrap this in useCallback to get a stable reference to the function,
  // which is then passed to the useSavedForm hook
  const onReplaceState = useCallback((savedState: State) => {
    dispatch({ type: 'replace-state', payload: savedState });
  }, []);

  const { ref: dropAreaRef, isDraggedOver: isFileOver } = useFileDrop({
    onUpload: onFileChange,
    allowMultiple: true
  });

  const callbackElementRef = useCallback(
    (element: HTMLDivElement) => {
      // both register the top-level DOM element locally and pass it to the code that sets it up as drop area
      elementRef.current = element;
      const dropAreaRefCleanup = dropAreaRef(element) as () => void;
      return () => dropAreaRefCleanup();
    },
    [dropAreaRef]
  );

  const validateEmail = () => {
    if (emailFieldRef.current) {
      setEmailFieldValid(emailFieldRef.current?.checkValidity());
    }
  };

  const { clearSavedForm } = useSavedForm({
    formName: FORM_NAME,
    currentState: state,
    updateState: onReplaceState
  });

  const onNameChange = (event: InputEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value;
    dispatch({ type: 'update-name', payload: name });
  };

  const onEmailChange = (event: InputEvent<HTMLInputElement>) => {
    const email = event.currentTarget.value;
    dispatch({ type: 'update-email', payload: email });
    validateEmail();
  };

  const onEmailFocus = () => {
    setEmailFieldFocussed(true);
  };

  const onEmailBlur = () => {
    setEmailFieldFocussed(false);
  };

  const onSubjectChange = (event: InputEvent<HTMLInputElement>) => {
    const subject = event.currentTarget.value;
    dispatch({ type: 'update-subject', payload: subject });
  };

  const onMessageChange = (event: InputEvent<HTMLTextAreaElement>) => {
    const message = event.currentTarget.value;
    dispatch({ type: 'update-message', payload: message });
  };

  const deleteFile = (index: number) => {
    dispatch({ type: 'remove-file', payload: index });
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setSubmissionState(LoadingState.LOADING);

    try {
      await submitForm({
        ...state,
        form_type: FORM_NAME
      });
      dispatch({ type: 'clear-form' });
      clearSavedForm();
      setSubmissionState(LoadingState.SUCCESS);
    } catch {
      setSubmissionState(LoadingState.ERROR);
      setTimeout(() => setSubmissionState(LoadingState.NOT_REQUESTED), 2000);
    }
  };

  if (submissionState === LoadingState.SUCCESS) {
    return (
      <div className={commonStyles.container}>
        <SubmissionSuccess />
      </div>
    );
  }

  const containerClasses = classNames(commonStyles.container, {
    [commonStyles.containerFileOver]: isFormValid && isFileOver
  });

  return (
    <div className={containerClasses} ref={callbackElementRef}>
      <div className={commonStyles.grid}>
        <p className={commonStyles.advisory}>
          <span>All fields are required</span>
          <span>Any attachments should add up to no more than 10 MB</span>
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
        <ShadedInput id="name" value={state.name} onInput={onNameChange} />

        <label htmlFor="email" className={commonStyles.label}>
          Your email
        </label>
        <ShadedInput
          id="email"
          type="email"
          ref={emailFieldRef}
          className={commonStyles.emailField}
          value={state.email}
          onInput={onEmailChange}
          onFocus={onEmailFocus}
          onBlur={onEmailBlur}
        />

        <label htmlFor="subject" className={commonStyles.label}>
          Subject
        </label>
        <ShadedInput
          id="subject"
          value={state.subject}
          onInput={onSubjectChange}
        />

        <label htmlFor="message" className={commonStyles.label}>
          Message
        </label>
        <ShadedTextarea
          id="message"
          value={state.message}
          onInput={onMessageChange}
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
            disabled={!isFormValid}
            allowMultiple={true}
            onUpload={onFileChange}
          />
        </div>

        <div className={commonStyles.submit}>
          {!isFormValid && (
            <div className={commonStyles.formErrors}>
              {!emailFieldValid && !emailFieldFocussed && (
                <div className={commonStyles.errorText}>
                  Please check the email address
                </div>
              )}
              {exceedsAttachmentsSizeLimit(state) && (
                <div className={commonStyles.errorText}>
                  Attachment(s) exceed 10 MB
                </div>
              )}
            </div>
          )}

          {isChallengeCompleted ? (
            <ControlledLoadingButton
              status={submissionState}
              className={commonStyles.submitButton}
              disabled={!isFormValid}
            >
              Send
            </ControlledLoadingButton>
          ) : (
            <>
              <span
                className={classNames(commonStyles.sliderLabel, {
                  [commonStyles.sliderLabelDisabled]: !isFormValid
                })}
              >
                Slide, then send
              </span>
              <SubmitSlider
                className={commonStyles.submitSlider}
                isDisabled={!isFormValid}
                onSlideCompleted={() => setIsChallengeCompleted(true)}
              />
            </>
          )}
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
    (field) => formState[field].trim().length > 0
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

export default ContactUsDefaultForm;
