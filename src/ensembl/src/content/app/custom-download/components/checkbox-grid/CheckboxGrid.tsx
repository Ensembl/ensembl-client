import React from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';

import styles from './CheckBoxGrid.scss';

type Props = {
  gridData: any;
  columns: number;
  hideUnchecked?: boolean;
  hideTitles?: boolean;
  checkboxOnChange: (status: boolean, subSection: string, id: string) => void;
};

export const filterCheckedAttributes = (attributes: any) => {
  const filteredAttributes: any = {};

  Object.keys(attributes).forEach((section) => {
    Object.keys(attributes[section]).forEach((attributeId) => {
      if (attributes[section][attributeId].checkedStatus === true) {
        filteredAttributes[attributeId] = attributes[section][attributeId];
      }
    });
  });

  return filteredAttributes;
};

export const getAttributesCount = (attributes: any) => {
  let totalAttributes = 0;

  if (!attributes || Object.keys(attributes).length === 0) {
    return 0;
  }
  Object.keys(attributes).forEach((section) => {
    totalAttributes += Object.keys(attributes[section]).length;
  });

  return totalAttributes;
};

const renderCheckBoxList = (
  checkboxList: any,
  props: Props,
  subSection: string
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
      {!!subSection && subSection !== 'default' && !props.hideTitles && (
        <div className={styles.checkboxGridTitle}>
          {subSection.charAt(0).toUpperCase() + subSection.slice(1)}
        </div>
      )}
      <div className={styles.checkboxGridContainer}>
        {gridMatrix.map((columnLength: number, gridKey: number) => {
          return (
            <div key={gridKey} style={singleGridStyle}>
              {checkboxListIDs
                .splice(0, columnLength)
                .map((item: string, itemKey: number) => {
                  if (
                    props.hideUnchecked &&
                    !checkboxList[item].checkedStatus
                  ) {
                    return null;
                  }

                  return (
                    <div key={itemKey} className={styles.checkboxContainer}>
                      <Checkbox
                        label={checkboxList[item].label}
                        checked={checkboxList[item].checkedStatus}
                        onChange={(status) => {
                          props.checkboxOnChange(status, subSection, item);
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
  if (!props.gridData || !Object.keys(props.gridData).length) {
    return null;
  }
  return (
    <>
      {props.gridData.hasOwnProperty('default')
        ? renderCheckBoxList(props.gridData.default, props, 'default')
        : null}
      {Object.keys(props.gridData).map((gridTitle: string, key: number) => {
        if (gridTitle === 'default') {
          return;
        }
        return (
          <div key={key}>
            {renderCheckBoxList(props.gridData[gridTitle], props, gridTitle)}
          </div>
        );
      })}
    </>
  );
};

export default CheckBoxGrid;
