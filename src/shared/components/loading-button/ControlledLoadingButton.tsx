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

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';

import Checkmark from 'static/icons/icon_tick.svg';
import Cross from 'static/icons/icon_cross.svg';

import { LoadingState } from 'src/shared/types/loading-state';

import styles from './LoadingButton.scss';

type Props = {
  onClick: () => unknown;
  status: LoadingState;
  isDisabled?: boolean;
  classNames?: {
    wrapper?: string;
    button?: string;
  };
  children: ReactNode;
};

const ControlledLoadingButton = (props: Props) => {
  const {
    status: loadingState,
    classNames: { wrapper: wrapperClassName, button: buttonClassName } = {},
    ...otherProps
  } = props;

  const wrapperClass = classNames(styles.buttonWrapper, wrapperClassName);

  const buttonClass =
    loadingState !== LoadingState.NOT_REQUESTED
      ? classNames(buttonClassName, styles.invisible)
      : buttonClassName;

  return (
    <div className={wrapperClass}>
      {loadingState === LoadingState.LOADING && <Loading />}
      {loadingState === LoadingState.SUCCESS && <Success />}
      {loadingState === LoadingState.ERROR && <ErrorIndicator />}
      <PrimaryButton className={buttonClass} {...otherProps} />
    </div>
  );
};

const Loading = () => (
  <div className={styles.loadingIndicator}>
    <CircleLoader className={styles.spinner} />
  </div>
);

const Success = () => (
  <div className={styles.successIndicator}>
    <Checkmark className={styles.checkmark} />
  </div>
);

const ErrorIndicator = () => (
  <div className={styles.errorIndicator}>
    <Cross className={styles.cross} />
  </div>
);

export default ControlledLoadingButton;
