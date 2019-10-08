import React from 'react';
import classNames from 'classnames';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
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
  isCollapsable?: boolean;
  isCollapsed?: boolean;
  onChange: (status: boolean, id: string) => void;
};

type NonCollapsableProps = AllProps & {
  isCollapsed?: false;
  isCollapsable?: false;
};

type CollapsableProps = AllProps & { hideLabel?: false };

export type CheckboxGridProps = NonCollapsableProps | CollapsableProps;

const CheckboxGrid = (props: CheckboxGridProps) => {
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

  const singleGridStyle = {
    width: 100 / props.columns + '%'
  };

  const checkboxGridContainerStyles = classNames(styles.checkboxGridContainer, {
    [styles.collapsed]: props.isCollapsed
  });

  const collapseButtonStyles = classNames(styles.collapseButton, {
    [styles.open]: !props.isCollapsed
  });
  return (
    <>
      {!props.hideLabel && (
        <div className={styles.checkboxGridHeader}>
          <span className={styles.label}>{props.label}</span>
          {props.isCollapsable && (
            <span className={styles.collapseButtonWrapper}>
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
