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
  createContext,
  useContext,
  type ReactNode,
  type ComponentProps
} from 'react';
import classNames from 'classnames';

import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './CollapsibleSection.module.css';

/**
 * PURPOSE OF THIS COMPONENT
 *
 * We already have a couple of similar components:
 * - Accordion
 * - Expandable section
 *
 * However, they seem to serve different purposes.
 * - The purpose of the Accordion component is to have control
 *   over several sections that can expand or collapse, which is why
 *   it wants to know ids for each section, and has a prop for
 *   allowing or disallowing multiple sections to be open at once.
 * - The purpose of the ExpandableSection is to show some content
 *   in a collapsed view vs in an expanded view. It does not have a
 *   separation between a clickable "head" and an informative "body"
 *
 * The purpose of this component, then, is to represent a single section
 * that can be expanded or collapsed by clicking on the button in its head.
 * In that, it is similar to an Accordion, but is much simpler, because
 * it only needs to be concerned with itself, and not with any of the sibling sections.
 *
 * A prime use case for this component is collapsible sections in the sidebar.
 */

type SectionContextType = {
  isOpen: boolean;
  disabled: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const SectionContext = createContext<SectionContextType | null>(null);

export const CollapsibleSection = (props: {
  isOpen?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  const isInitiallyOpen = props.isOpen ?? true;
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const componentClasses = classNames(styles.section, props.className);

  return (
    <SectionContext.Provider
      value={{
        isOpen,
        disabled: props.disabled ?? false,
        setIsOpen
      }}
    >
      <div className={componentClasses} aria-expanded={isOpen}>
        {props.children}
      </div>
    </SectionContext.Provider>
  );
};

export const CollapsibleSectionHead = (props: ComponentProps<'button'>) => {
  const { className: classNameFromProps, children, ...otherProps } = props;
  const context = useContext(SectionContext);

  if (!context) {
    throw new Error(
      'CollapsibleSectionHead must be used inside of CollapsibleSection component'
    );
  }

  const { isOpen, setIsOpen } = context;

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const chevronDirection = isOpen ? 'up' : 'down';
  const componentClasses = classNames(styles.sectionHead, classNameFromProps);

  return (
    <button
      {...otherProps}
      onClick={onClick}
      aria-expanded={isOpen}
      className={componentClasses}
    >
      {children}
      <Chevron direction={chevronDirection} animate={true} />
    </button>
  );
};

export const CollapsibleSectionBody = (props: {
  children: ReactNode;
  className?: string;
}) => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error(
      'CollapsibleSectionBody must be used inside of CollapsibleSection component'
    );
  }

  if (!context.isOpen || context.disabled) {
    return null;
  }

  const componentClasses = classNames(styles.sectionBody, props.className);

  return <div className={componentClasses}>{props.children}</div>;
};
