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
  useReducer,
  useCallback,
  useRef
} from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { submitForm } from '../submitForm';
import noEarlierThan from 'src/shared/utils/noEarlierThan';
import useSavedForm from '../hooks/useSavedForm';

import SubmissionSuccess from '../submission-success/SubmissionSuccess';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import ShadedTextarea from 'src/shared/components/textarea/ShadedTextarea';
import Upload from 'src/shared/components/upload/Upload';
import UploadedFile from 'src/shared/components/uploaded-file/UploadedFile';
import SubmitSlider from '../submit-slider/SubmitSlider';
import { ControlledLoadingButton } from 'src/shared/components/loading-button';

import { LoadingState } from 'src/shared/types/loading-state';

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

type ReplaceStateAction = {
  type: 'replace-state';
  payload: State;
};

type Action =
  | UpdateNameAction
  | UpdateEmailAction
  | UpdateSubjectAction
  | UpdateMessageAction
  | AddFileAction
  | RemoveFileAction
  | ReplaceStateAction;

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
    case 'replace-state':
      return action.payload;
    default:
      return state;
  }
};

const FORM_NAME = 'contact-us-general';

const ContactUsInitialForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
  const [emailFieldValid, setEmailFieldValid] = useState(true);
  const [emailFieldFocussed, setEmailFieldFocussed] = useState(false);
  const [submissionState, setSubmissionState] = useState<LoadingState>(
    LoadingState.NOT_REQUESTED
  );

  const formRef = useRef<HTMLFormElement>(null);
  const emailFieldRef = useRef<HTMLInputElement | null>(null);
  const stateRef = useRef<typeof state>();
  stateRef.current = state;

  const { clearSavedForm } = useSavedForm({
    formName: FORM_NAME,
    currentState: state,
    updateState: (savedState) =>
      dispatch({ type: 'replace-state', payload: savedState })
  });

  useEffect(() => {
    // TODO: this useEffect will be unnecessary when the Input is refactored to include forwardRef
    const emailInput = formRef.current?.querySelector('#email');
    if (emailInput) {
      emailFieldRef.current = emailInput as HTMLInputElement;
    }
  }, [formRef.current]);

  const onNameChange = useCallback((value: string) => {
    dispatch({ type: 'update-name', payload: value });
  }, []);

  const onEmailChange = useCallback((value: string) => {
    dispatch({ type: 'update-email', payload: value });
    validateEmail();
  }, []);

  const onEmailFocus = useCallback(() => {
    setEmailFieldFocussed(true);
  }, []);

  const onEmailBlur = useCallback(() => {
    setEmailFieldFocussed(false);
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

  const validateEmail = useCallback(() => {
    if (emailFieldRef.current) {
      setEmailFieldValid(emailFieldRef.current?.checkValidity());
    }
  }, [emailFieldRef.current]);

  const deleteFile = (index: number) => {
    dispatch({ type: 'remove-file', payload: index });
  };

  const handleSubmit = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!stateRef.current) {
      return; // shouldn't happen, but makes Typescript happy
    }

    setSubmissionState(LoadingState.LOADING);

    const submitPromise = submitForm({
      ...stateRef.current,
      form_type: FORM_NAME
    });

    noEarlierThan(submitPromise, 1000)
      .then(() => {
        clearSavedForm();
        setSubmissionState(LoadingState.SUCCESS);
      })
      .catch(() => {
        setSubmissionState(LoadingState.ERROR);
        setTimeout(() => setSubmissionState(LoadingState.NOT_REQUESTED), 2000);
      });
  }, []);

  const isFormValid = validate(state) && emailFieldValid;

  if (submissionState === LoadingState.SUCCESS) {
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
        ref={formRef}
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
        <ShadedInput
          id="email"
          type="email"
          className={commonStyles.emailField}
          value={state.email}
          onChange={onEmailChange}
          onFocus={onEmailFocus}
          onBlur={onEmailBlur}
        />

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
              classNames={{
                wrapper: commonStyles.submitButtonWrapper,
                button: commonStyles.submitButton
              }}
              isDisabled={!isFormValid}
              onClick={noop}
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

export default ContactUsInitialForm;
