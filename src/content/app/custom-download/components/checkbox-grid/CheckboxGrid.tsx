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

import React, { useState } from 'react';
import classNames from 'classnames';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import { Modify } from 'src/shared/types/utility-types/modify';

import styles from './CheckboxGrid.scss';

export type CheckboxGridOption = {
  isChecked: boolean;
  id: string;
  label: string;
};

type AllProps = {
  options: CheckboxGridOption[];
  columns: number;
  hideUnchecked?: boolean;
  label: string;
  hideLabel?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onChange: (status: boolean, id: string) => void;
  onCollapse?: (collapsed: boolean) => void;
};

type NonCollapsibleProps = Modify<
  AllProps,
  {
    isCollapsed?: false;
    isCollapsible?: false;
  }
>;

type CollapsibleProps = Modify<AllProps, { hideLabel?: false }>;

export type CheckboxGridProps = NonCollapsibleProps | CollapsibleProps;

const CheckboxGrid = (props: CheckboxGridProps) => {
  const [collapsed, setCollapsed] = useState(props.isCollapsed);

  let options = [...props.options];

  if (props.hideUnchecked) {
    options = options.filter((attribute: CheckboxGridOption) => {
      return attribute.isChecked;
    });
  }
  if (!options.length) {
    return null;
  }

  const gridMatrix = Array(props.columns).fill(0);

  let totalCheckbox = options.length;

  for (let i = 0; i < options.length; i++) {
    if (totalCheckbox <= 0) {
      break;
    }
    for (let j = 0; j < props.columns; j++) {
      if (totalCheckbox <= 0) {
        break;
      }
      totalCheckbox -= 1;
      if (options[i + j]) {
        gridMatrix[j] += 1;
      }
    }
  }

  const toggleCollapsedState = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (props.onCollapse) {
      props.onCollapse(newCollapsedState);
    }
  };

  const singleGridStyle = {
    width: 100 / props.columns + '%'
  };

  const checkboxGridContainerStyles = classNames(styles.checkboxGridContainer, {
    [styles.collapsed]: collapsed
  });

  const collapseButtonStyles = classNames(styles.collapseButton, {
    [styles.open]: !collapsed
  });
  return (
    <>
      {!props.hideLabel && props.label && (
        <div className={styles.checkboxGridHeader}>
          <span className={styles.label}>{props.label}</span>
          {props.isCollapsible && (
            <span
              className={styles.collapseButtonWrapper}
              onClick={toggleCollapsedState}
            >
              <span className={collapseButtonStyles}></span>
            </span>
          )}
        </div>
      )}
      <div className={checkboxGridContainerStyles}>
        {gridMatrix.map((columnLength: number, gridKey: number) => {
          return (
            <div key={gridKey} style={singleGridStyle}>
              {options
                .splice(0, columnLength)
                .map((attribute: CheckboxGridOption, itemKey: number) => {
                  return (
                    <div key={itemKey} className={styles.checkboxContainer}>
                      <Checkbox
                        label={attribute.label}
                        checked={Boolean(attribute.isChecked)}
                        theme="lighter"
                        onChange={(status) => {
                          props.onChange(status, attribute.id);
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </>
  );
};

CheckboxGrid.defaultProps = {
  columns: 3
};

export default CheckboxGrid;
