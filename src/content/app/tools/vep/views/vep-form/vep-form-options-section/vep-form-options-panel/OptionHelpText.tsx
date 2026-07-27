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

import { Fragment } from 'react';
import type { ReactNode } from 'react';

import ExternalLinkIcon from 'src/content/app/tools/vep/components/external-link-icon/ExternalLinkIcon';

import type { OptionHelp } from 'src/content/app/tools/vep/types/vepFormConfig';

import styles from './optionHelp.module.css';

const DEFAULT_LINK_LABEL = 'More information';

// Render a description string, turning each `*span*` into emphasised text. This
// restricted markdown subset lets the description stay a plain (serialisable)
// string in the data layer while still supporting inline emphasis.
const renderDescription = (description: string): ReactNode[] =>
  description
    .split(/(\*[^*]+\*)/g)
    .map((part, index) =>
      part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
        <em key={index}>{part.slice(1, -1)}</em>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      )
    );

const HelpLink = (props: { href: string; label?: string }) => (
  <a
    className={styles.helpLink}
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {props.label ?? DEFAULT_LINK_LABEL}
    <ExternalLinkIcon />
  </a>
);

/**
 * Renders structured option help (see the `OptionHelp` API contract) into
 * tooltip content: the description followed by any resource links. Presentation
 * only — it neither knows nor cares whether the help came from the API or the
 * local fallback map.
 */
const OptionHelpText = (props: { help: OptionHelp }) => {
  const { description, links } = props.help;
  return (
    <>
      {renderDescription(description)}
      {links?.map((link) => (
        <Fragment key={link.href}>
          {' '}
          <HelpLink href={link.href} label={link.label} />
        </Fragment>
      ))}
    </>
  );
};

export default OptionHelpText;
