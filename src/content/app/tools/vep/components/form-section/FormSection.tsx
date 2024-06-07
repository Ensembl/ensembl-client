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

import type { ReactNode } from 'react';

import styles from './FormSection.module.css';

/**
 * This component has first appeared in VEP submission form;
 * but it is almost a certainty that it will be used in other places as well.
 *
 * There already exist two similar components: Accordion and ExpandableSection;
 * however, this new components doesn't seem to fit either of those:
 * - Both the Accordion and the ExpandableSection components have a predefined
 *   toggle element (an upwards- or downwards-pointing chevron); and in case of
 *   the Accordion, the whole area of the closed section acts as a button.
 *   In contrast, this new component can have anything in the right-hand corner.
 * - Both the Accordion and the ExpandableSection components have a clear
 *   distinction between the "closed" (collapsed) and the "opened" (expanded)
 *   states. In contrast, this new component can show none of its content,
 *   a little bit of its content, or its full content (see e.g. behaviour of
 *   a VEP options section, which may show none of the options, some of the options,
 *   or all options)
 *
 * Here is what this component needs to be able to do:
 * - It has a border; yet, when it is immediately followed by another FormSection,
 *   their adjacent borders should visually collapse into one.
 */

type Props = {
  children: ReactNode;
  className?: string;
};

const FormSection = (props: Props) => {
  const componentClasses = classNames(styles.container, props.className);

  return <div className={componentClasses}>{props.children}</div>;
};

export default FormSection;
