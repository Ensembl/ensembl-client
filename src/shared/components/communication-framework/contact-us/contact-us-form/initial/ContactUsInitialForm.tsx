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
  type FormEvent
} from 'react';
import classNames from 'classnames';

import { submitForm } from '../submitForm';
import noEarlierThan from 'src/shared/utils/noEarlierThan';
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
    case 'remove-file':
      const newFiles = [...state.files];
      newFiles.splice(action.payload, 1);
      return { ...state, files: newFiles };
    case 'replace-state':
      return action.payload;
    case 'clear-form':
      return initialState;
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

  const emailFieldRef = useRef<HTMLInputElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<typeof state>();
  stateRef.current = state;

  const isFormValid = validate(state) && emailFieldValid;

  const onFileChange = useCallback(
    (files: File[]) => {
      if (!isFormValid) {
        return;
      }
      for (const file of files) {
        dispatch({ type: 'add-file', payload: file });
      }
    },
    [isFormValid]
  );

  const { ref: dropAreaRef, isDraggedOver: isFileOver } = useFileDrop({
    onUpload: onFileChange,
    allowMultiple: true
  });

  const callbackElementRef = useCallback((element: HTMLDivElement) => {
    // both register the top-level DOM element locally and pass it to the code that sets it up as drop area
    elementRef.current = element;
    dropAreaRef(element);
  }, []);

  const { clearSavedForm } = useSavedForm({
    formName: FORM_NAME,
    currentState: state,
    updateState: (savedState) =>
      dispatch({ type: 'replace-state', payload: savedState })
  });

  const onNameChange = useCallback((event: FormEvent<HTMLInputElement>) => {
    const name = event.currentTarget.value;
    dispatch({ type: 'update-name', payload: name });
  }, []);

  const onEmailChange = useCallback((event: FormEvent<HTMLInputElement>) => {
    const email = event.currentTarget.value;
    dispatch({ type: 'update-email', payload: email });
    validateEmail();
  }, []);

  const onEmailFocus = useCallback(() => {
    setEmailFieldFocussed(true);
  }, []);

  const onEmailBlur = useCallback(() => {
    setEmailFieldFocussed(false);
  }, []);

  const onSubjectChange = useCallback((event: FormEvent<HTMLInputElement>) => {
    const subject = event.currentTarget.value;
    dispatch({ type: 'update-subject', payload: subject });
  }, []);

  const onMessageChange = useCallback(
    (event: FormEvent<HTMLTextAreaElement>) => {
      const message = event.currentTarget.value;
      dispatch({ type: 'update-message', payload: message });
    },
    []
  );

  const validateEmail = useCallback(() => {
    if (emailFieldRef.current) {
      setEmailFieldValid(emailFieldRef.current?.checkValidity());
    }
  }, [emailFieldRef.current]);

  const deleteFile = (index: number) => {
    dispatch({ type: 'remove-file', payload: index });
  };

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!stateRef.current) {
      return; // shouldn't happen, but makes Typescript happy
    }

    setSubmissionState(LoadingState.LOADING);

    const submitPromise = submitForm({
      ...stateRef.current,
      form_type: FORM_NAME
    });

    trackFormSubmission(); // probably best track it here, regardless of whether the submission was successful; it represents intent to submit

    noEarlierThan(submitPromise, 1000)
      .then(() => {
        dispatch({ type: 'clear-form' });
        clearSavedForm();
        setSubmissionState(LoadingState.SUCCESS);
      })
      .catch(() => {
        setSubmissionState(LoadingState.ERROR);
        setTimeout(() => setSubmissionState(LoadingState.NOT_REQUESTED), 2000);
      });
  }, []);

  // dispatches an event that the "Contact us" form has been submitted; used for analytics purposes
  const trackFormSubmission = () => {
    const trackContactUsSubmission = new CustomEvent('analytics', {
      detail: {
        category: 'contact_us',
        action: 'contact_form_submited'
      },
      bubbles: true
    });

    elementRef.current?.dispatchEvent(trackContactUsSubmission);
  };

  if (submissionState === LoadingState.SUCCESS) {
    return <SubmissionSuccess />;
  }

  const containerClasses = classNames(commonStyles.container, {
    [commonStyles.containerFileOver]: isFormValid && isFileOver
  });

  return (
    <div className={containerClasses} ref={callbackElementRef}>
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
        <ShadedInput
          id="email"
          type="email"
          ref={emailFieldRef}
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

export default ContactUsInitialForm;
