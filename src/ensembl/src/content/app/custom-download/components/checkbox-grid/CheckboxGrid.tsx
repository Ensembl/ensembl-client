import React from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import JSONValue from 'src/shared/types/JSON';

import styles from './CheckBoxGrid.scss';

type Props = {
  gridData: JSONValue;
  columns: number;
  hideUnchecked?: boolean;
  hideTitles?: boolean;
  checkboxOnChange: (status: boolean, subSection: string, id: string) => void;
};

export const filterCheckedAttributes = (attributes: JSONValue) => {
  const filteredAttributes: JSONValue = {};

  Object.keys(attributes).forEach((section: string) => {
    Object.keys(attributes[section] as JSONValue).forEach(
      (attributeId: string) => {
        if (
          ((attributes[section] as JSONValue)[attributeId] as JSONValue)
            .isChecked === true
        ) {
          if (!filteredAttributes[section]) {
            filteredAttributes[section] = {};
          }
          (filteredAttributes[section] as JSONValue)[attributeId] = (attributes[
            section
          ] as JSONValue)[attributeId];
        }
      }
    );
  });

  return filteredAttributes;
};

export const getAttributesCount = (attributes: JSONValue) => {
  let totalAttributes = 0;

  const attributeKeys = Object.keys(attributes);

  if (!attributes || attributeKeys.length === 0) {
    return 0;
  }
  attributeKeys.forEach((section) => {
    totalAttributes += Object.keys(attributes[section] as JSONValue).length;
  });

  return totalAttributes;
};

const renderCheckBoxList = (
  checkboxList: JSONValue,
  props: Props,
  subSection: string
) => {
  const checkboxListKeys = Object.keys(checkboxList);

  if (!checkboxListKeys.length) {
    return null;
  }

  const checkboxListIDs = checkboxListKeys.sort();

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
                    !(checkboxList[item] as JSONValue).isChecked
                  ) {
                    return null;
                  }

                  return (
                    <div key={itemKey} className={styles.checkboxContainer}>
                      <Checkbox
                        label={(checkboxList[item] as JSONValue).label}
                        checked={
                          (checkboxList[item] as JSONValue).isChecked as boolean
                        }
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
  const gridDataKeys = Object.keys(props.gridData);

  if (!props.gridData || !gridDataKeys.length) {
    return null;
  }
  return (
    <>
      {props.gridData.hasOwnProperty('default')
        ? renderCheckBoxList(
            props.gridData['default'] as JSONValue,
            props,
            'default'
          )
        : null}
      {gridDataKeys.map((gridTitle: string, key: number) => {
        if (gridTitle === 'default') {
          return;
        }
        return (
          <div key={key}>
            {renderCheckBoxList(
              props.gridData[gridTitle] as JSONValue,
              props,
              gridTitle
            )}
          </div>
        );
      })}
    </>
  );
};

CheckBoxGrid.defaultProps = {
  columns: 3
};

export default CheckBoxGrid;
