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

import { useState, useEffect, type ReactNode } from 'react';
import classNames from 'classnames';

import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './ExpandableSection.module.css';

export type ExpandableSectionProps = {
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  isExpanded?: boolean;
  classNames?: {
    wrapper?: string;
    expanded?: string;
    collapsed?: string;
  };
  onToggle?: (isExpanded: boolean) => void;
};

const ExpandableSection = (props: ExpandableSectionProps) => {
  const { isExpanded: isExpandedProp = false } = props;
  const [isExpanded, setIsExpanded] = useState(isExpandedProp);

  useEffect(() => {
    if (isExpanded !== isExpandedProp) {
      setIsExpanded(isExpandedProp);
    }
  }, [isExpandedProp]);

  const wrapperClassNames = classNames(
    styles.expandableSection,
    props.classNames?.wrapper
  );

  const expandedContentClassNames = classNames(
    styles.expandedContent,
    props.classNames?.expanded
  );

  const collapsedContentClassNames = props.classNames?.collapsed;

  const toggleExpanded = () => {
    props.onToggle && props.onToggle(!isExpanded);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={wrapperClassNames}>
      {props.expandedContent && (
        <div className={styles.toggle} onClick={toggleExpanded}>
          <Chevron
            direction={isExpanded ? 'up' : 'down'}
            animate={true}
            className={styles.chevron}
          />
        </div>
      )}

      {isExpanded ? (
        <div className={expandedContentClassNames}>{props.expandedContent}</div>
      ) : (
        <div className={collapsedContentClassNames}>
          {props.collapsedContent}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
