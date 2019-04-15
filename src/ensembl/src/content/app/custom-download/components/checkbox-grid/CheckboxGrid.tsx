import React from 'react';
import { Checkbox } from 'src/shared';

import styles from './CheckBoxGrid.scss';

type Props = {
  gridData: any;
  columns: number;
  checkboxOnChange: (status: boolean, id: string) => void;
};

const renderCheckBoxList = (
  checkboxList: any,
  props: Props,
  title?: string
) => {
  if (!Object.keys(checkboxList).length) {
    return null;
  }

  const checkboxListIDs = Object.keys(checkboxList).sort();

  const gridMatrix = Array(props.columns).fill(0);

  let totalCheckbox = checkboxListIDs.length;

  for (let i = 0; i < checkboxListIDs.length; i++) {
    if (totalCheckbox <= 0) {
      break;
    }
    for (let j = 0; j < props.columns; j++) {
      if (totalCheckbox <= 0) {
        break;
      }
      totalCheckbox -= 1;
      if (checkboxListIDs[i + j]) {
        gridMatrix[j] += 1;
      }
    }
  }

  const singleGridStyle = {
    width: 100 / props.columns + '%'
  };
  return (
    <>
      {!!title && <div className={styles.checkboxGridTitle}>{title}</div>}
      <div className={styles.checkboxGridContainer}>
        {gridMatrix.map((columnLength: number, gridKey: number) => {
          return (
            <div key={gridKey} style={singleGridStyle}>
              {checkboxListIDs
                .splice(0, columnLength)
                .map((item: string, itemKey: number) => {
                  return (
                    <div key={itemKey} className={styles.checkboxContainer}>
                      <Checkbox
                        label={checkboxList[item].label}
                        checked={checkboxList[item].checkedStatus}
                        onChange={(status) => {
                          props.checkboxOnChange(status, checkboxList[item].id);
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

const CheckBoxGrid = (props: Props) => {
  return (
    <>
      {renderCheckBoxList(props.gridData.default, props)}
      {Object.keys(props.gridData).map((gridTitle: string, key: number) => {
        if (gridTitle === 'default') {
          return;
        }
        return (
          <div key={key}>
            {' '}
            {renderCheckBoxList(
              props.gridData[gridTitle],
              props,
              gridTitle
            )}{' '}
          </div>
        );
      })}
    </>
  );
};

export default CheckBoxGrid;
