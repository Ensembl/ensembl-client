import React from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import AttributesSection, {
  AttributesSubSection,
  Attribute
} from 'src/content/app/custom-download/types/Attributes';
import styles from './CheckboxGrid.scss';

import orderBy from 'lodash/orderBy';

type Props = {
  gridData: AttributesSection;
  columns: number;
  hideUnchecked?: boolean;
  hideTitles?: boolean;
  checkboxOnChange: (status: boolean, subSection: string, id: string) => void;
};

export const filterCheckedAttributes = (attributes: AttributesSection) => {
  const filteredAttributes: AttributesSection = {};

  Object.keys(attributes).forEach((section: string) => {
    Object.keys(attributes[section]).forEach((attributeId: string) => {
      if (attributes[section][attributeId].isChecked === true) {
        if (!filteredAttributes[section]) {
          filteredAttributes[section] = {};
        }
        filteredAttributes[section][attributeId] =
          attributes[section][attributeId];
      }
    });
  });

  return filteredAttributes;
};

export const getAttributesCount = (attributes: AttributesSection) => {
  let totalAttributes = 0;

  const attributeKeys = Object.keys(attributes);

  if (!attributes || attributeKeys.length === 0) {
    return 0;
  }
  attributeKeys.forEach((section) => {
    totalAttributes += Object.keys(attributes[section]).length;
  });

  return totalAttributes;
};

const renderCheckBoxList = (
  checkboxList: AttributesSubSection,
  props: Props,
  subSection: string
) => {
  const orderedCheckboxList: Attribute[] = orderBy(checkboxList, ['label']);

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
      {!!subSection && subSection !== 'default' && !props.hideTitles && (
        <div className={styles.checkboxGridTitle}>
          {subSection.charAt(0).toUpperCase() + subSection.slice(1)}
        </div>
      )}
      <div className={styles.checkboxGridContainer}>
        {gridMatrix.map((columnLength: number, gridKey: number) => {
          return (
            <div key={gridKey} style={singleGridStyle}>
              {orderedCheckboxList
                .splice(0, columnLength)
                .map((attribute: Attribute, itemKey: number) => {
                  if (props.hideUnchecked && !attribute.isChecked) {
                    return null;
                  }

                  return (
                    <div key={itemKey} className={styles.checkboxContainer}>
                      <Checkbox
                        label={attribute.label}
                        checked={attribute.isChecked}
                        onChange={(status) => {
                          props.checkboxOnChange(
                            status,
                            subSection,
                            attribute.id
                          );
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

const CheckboxGrid = (props: Props) => {
  if (!props.gridData) {
    return null;
  }

  const gridDataKeys = Object.keys(props.gridData);

  if (!gridDataKeys.length) {
    return null;
  }

  return (
    <>
      {props.gridData.hasOwnProperty('default')
        ? renderCheckBoxList(props.gridData['default'], props, 'default')
        : null}
      {gridDataKeys.map((gridTitle: string, key: number) => {
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

CheckboxGrid.defaultProps = {
  columns: 3
};

export default CheckboxGrid;
