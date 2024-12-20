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

import { useState, type ComponentPropsWithRef } from 'react';
import classNames from 'classnames';

import { CircleLoader } from 'src/shared/components/loader';

import DownloadIcon from 'static/icons/icon_download.svg';
import Checkmark from 'static/icons/icon_tick.svg';
import Cross from 'static/icons/icon_cross.svg';

import { LoadingState } from 'src/shared/types/loading-state';

import styles from './DownloadButton.module.css';

type Props = Omit<ComponentPropsWithRef<'button'>, 'children' | 'onClick'> & {
  onClick: () => unknown;
};

const DownloadButton = (props: Props) => {
  const [status, setStatus] = useState(LoadingState.NOT_REQUESTED);
  const { onClick, ...otherProps } = props;

  const clickHandler = async () => {
    setStatus(LoadingState.LOADING);
    try {
      await onClick();
      setStatus(LoadingState.SUCCESS);
    } catch {
      setStatus(LoadingState.ERROR);
    } finally {
      setTimeout(() => {
        setStatus(LoadingState.NOT_REQUESTED);
      }, 1000);
    }
  };

  return (
    <ControlledDownloadButton
      {...otherProps}
      status={status}
      onClick={clickHandler}
    />
  );
};

type ControlledProps = Props & {
  status: LoadingState;
};

const ControlledDownloadButton = (props: ControlledProps) => {
  const { className, status, ...otherProps } = props;

  const elementClasses = classNames(
    styles.downloadButton,
    {
      [styles.downloadButtonDisabled]: props.disabled,
      [styles.downloadButtonLoading]: status === LoadingState.LOADING,
      [styles.downloadButtonSuccess]: status === LoadingState.SUCCESS,
      [styles.downloadButtonError]: status === LoadingState.ERROR
    },
    className
  );

  const isDisabled = status !== LoadingState.NOT_REQUESTED || props.disabled;

  return (
    <button {...otherProps} className={elementClasses} disabled={isDisabled}>
      {getButtonContent(status)}
    </button>
  );
};

const getButtonContent = (status: LoadingState) => {
  switch (status) {
    case LoadingState.LOADING:
      return <CircleLoader size="small" />;
    case LoadingState.SUCCESS:
      return <Checkmark />;
    case LoadingState.ERROR:
      return <Cross />;
    default:
      return <DownloadIcon />;
  }
};

export { ControlledDownloadButton };
export default DownloadButton;
