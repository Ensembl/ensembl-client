import React from 'react';
import classNames from 'classnames';

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import styles from './EntityViewerTranscriptFilter.scss';

export type Option = {
  value: string;
  label: string;
};

export type OptionsGroup = Option[];

type Props = {
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  optionGroups: OptionsGroup[];
  isExpanded: boolean;
};

const EntityViewerTranscriptFilter = (props: Props) => {
  const handleChange = (isChecked: boolean, optionIndex: [number, number]) => {
    const [groupIndex, itemIndex] = optionIndex;
    const selectedOption = props.optionGroups[groupIndex][itemIndex].value;

    if (isChecked) {
      const newSelectedOptions = [...props.selectedValues, selectedOption];
      props.onChange(newSelectedOptions);
    } else {
      const newSelectedOptions = [...props.selectedValues].filter(
        (option) => option !== selectedOption
      );

      props.onChange(newSelectedOptions);
    }
  };

  return (
    <div className={styles.wrapper}>
      {props.optionGroups.map((options, groupIndex) => {
        const optionGroupClassName = classNames(styles.checkboxPadding, {
          [styles.optionGroup]: props.isExpanded
        });

        return (
          <div key={groupIndex} className={optionGroupClassName}>
            {options.map((option, itemIndex) => {
              const checkedStatus = props.selectedValues.includes(option.value);
              if (!props.isExpanded && !checkedStatus) {
                return null;
              }

              return (
                <div key={itemIndex}>
                  <Checkbox
                    label={option.label}
                    labelClassName={styles.checkboxLabel}
                    checked={checkedStatus}
                    onChange={(status) =>
                      handleChange(status, [groupIndex, itemIndex])
                    }
                    classNames={{
                      unchecked: styles.checkboxUnchecked,
                      checked: styles.checkboxChecked
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

EntityViewerTranscriptFilter.defaultProps = {
  isExpanded: true
};

export default EntityViewerTranscriptFilter;
