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
  options: OptionsGroup[];
  hideUnchecked?: boolean;
};

const EntityViewerTranscriptFilter = (props: Props) => {
  const handleChange = (status: boolean, optionIndex: [number, number]) => {
    const [groupIndex, itemIndex] = optionIndex;
    const selectedOption = props.options[groupIndex][itemIndex].value;

    if (status) {
      const newSelectedOptions = [...props.selectedValues, selectedOption];
      props.onChange(newSelectedOptions);
    } else {
      const newSelectedOptions = [...props.selectedValues].filter(
        (option) => option != selectedOption
      );

      props.onChange(newSelectedOptions);
    }
  };

  return (
    <div className={styles.defaultWrapper}>
      {props.options.map((options, groupIndex) => {
        const optionGroupClassName = classNames(styles.checkboxPadding, {
          [styles.optionGroup]: !props.hideUnchecked
        });

        return (
          <div key={groupIndex} className={optionGroupClassName}>
            {options.map((option, itemIndex) => {
              const checkedStatus =
                props.selectedValues.indexOf(option.value) !== -1;
              if (props.hideUnchecked && !checkedStatus) {
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
                      unchecked: styles.checkboxUnchecked
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

export default EntityViewerTranscriptFilter;
