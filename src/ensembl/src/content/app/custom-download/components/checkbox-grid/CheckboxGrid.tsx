import React from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import styles from './CheckboxGrid.scss';

import orderBy from 'lodash/orderBy';

import Attribute from 'src/content/app/custom-download/types/Attributes';

export type CheckboxGridOption = {
  isChecked: boolean;
  id: string;
  label: string;
};

export type CheckboxGridProps = {
  options: Attribute[];
  columns: number;
  hideUnchecked?: boolean;
  hideLabel?: boolean;
  label: string;
  onChange: (status: boolean, id: string) => void;
};

export const filterCheckedAttributes = (attributes: Attribute[]) => {
  return attributes;
};

const CheckboxGrid = (props: CheckboxGridProps) => {
  let orderedCheckboxList: Attribute[] = orderBy(props.options, ['label']);

  if (props.hideUnchecked) {
    orderedCheckboxList = orderedCheckboxList.filter((attribute: Attribute) => {
      return attribute.isChecked;
    });
  }
  if (!orderedCheckboxList.length) {
    return null;
  }

  const gridMatrix = Array(props.columns).fill(0);

  let totalCheckbox = orderedCheckboxList.length;

  for (let i = 0; i < orderedCheckboxList.length; i++) {
    if (totalCheckbox <= 0) {
      break;
    }
    for (let j = 0; j < props.columns; j++) {
      if (totalCheckbox <= 0) {
        break;
      }
      totalCheckbox -= 1;
      if (orderedCheckboxList[i + j]) {
        gridMatrix[j] += 1;
      }
    }
  }

  const singleGridStyle = {
    width: 100 / props.columns + '%'
  };
  return (
    <>
      {!props.hideLabel && (
        <div className={styles.checkboxGridTitle}>{props.label}</div>
      )}
      <div className={styles.checkboxGridContainer}>
        {gridMatrix.map((columnLength: number, gridKey: number) => {
          return (
            <div key={gridKey} style={singleGridStyle}>
              {orderedCheckboxList
                .splice(0, columnLength)
                .map((attribute: Attribute, itemKey: number) => {
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
