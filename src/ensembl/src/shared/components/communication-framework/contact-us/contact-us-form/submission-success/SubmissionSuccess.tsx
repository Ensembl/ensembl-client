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
import { useDispatch } from 'react-redux';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';

import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './SubmissionSuccess.scss';

const SubmissionSuccess = () => {
  const dispatch = useDispatch();

  const onButtonClick = () => {
    dispatch(toggleCommunicationPanel());
  };

  return (
    <div className={styles.submissionSuccess}>
      <p>Your message has been sent to our HelpDesk</p>
      <p>
        You should receive an auto-reply with a ticket number within 24 hours
        <br />
        If you do not get this, please try again, checking your email address
      </p>
      <p className={styles.thankyou}>Thank you</p>
      <PrimaryButton onClick={onButtonClick}>Close</PrimaryButton>
    </div>
  );
};

export default SubmissionSuccess;
