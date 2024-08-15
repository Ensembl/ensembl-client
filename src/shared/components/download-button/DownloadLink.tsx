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

  // TODO: update the below after migration to React 19.
  // React 19 will update type definitions of HTMLAnchorElement to allow inert: boolean.
  // For react versions below 19, typescript will complain about the `inert` attribute;
  // and the componentProps object below (as well as the empty string value) is an attempt to trick typescript.
  // IMPORTANT: in React 19, inert="" will be treated as false instead of true;
  // so we will need to change the below during migration.
  // (see https://github.com/facebook/react/issues/17157#issuecomment-2003750544)
  const componentProps = {
    className: componentClasses,
    download: true,
    inert: disabled ? '' : undefined,
    ...otherProps
  };

  return (
    <a {...componentProps}>
      <DownloadIcon />
    </a>
  );
};

export default DownloadLink;
