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

import classNames from 'classnames';
import type { AnchorHTMLAttributes } from 'react';

import DownloadIcon from 'static/icons/icon_download.svg';

import styles from './DownloadButton.module.css';

/**
 * This component looks like the DonwloadButton component;
 * but creates an html `a` element instead of an html `button` element.
 * Use it when the server responds with a file, and no extra client-side logic is required.
 */

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  disabled?: boolean;
};

const DownloadLink = (props: Props) => {
  const { disabled, className: classNameFromProps, ...otherProps } = props;

  const componentClasses = classNames(
    styles.downloadButton,
    {
      [styles.downloadButtonDisabled]: disabled
    },
    classNameFromProps
  );

  return (
    <a
      className={componentClasses}
      download={true}
      inert={disabled || undefined}
      {...otherProps}
    >
      <DownloadIcon />
    </a>
  );
};

export default DownloadLink;
