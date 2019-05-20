import React from 'react';
import { Checkbox } from 'src/shared';
import Select, { Option, OptionGroup } from 'src/shared/select/Select';
import styles from './CheckboxMultiselect.scss';

type Props = {
  selectOptions: Option[];
  checked: boolean;
  label: string;
  selectedOptions: [];
  onChange: (status: boolean) => void;
};

const CheckboxMultiselect = (props: Props) => {
  const handleOnChange = (checkedStatus: boolean) => {
    props.onChange(checkedStatus);
  };

  const handleOnSelect = (a, b) => {
    // props.onChange();
    console.log(a, b);
  };

  const firstSelectedOption = props.selectedOptions.shift();
  const firstSelectOptions = props.selectOptions.map((option: any) => {
    if (option.value === firstSelectedOption) {
      option.isSelected = true;
    }
    return option;
  });

  return (
    <>
      <table className={styles.multiselectTable}>
        <tbody>
          <tr>
            <td>
              <Checkbox
                checked={props.checked}
                onChange={handleOnChange}
                label={props.label}
              />
            </td>
            <td>
              {props.checked && (
                <div>
                  <Select
                    options={firstSelectOptions}
                    onSelect={handleOnSelect}
                  />
                </div>
              )}
            </td>
            <td>{!!firstSelectedOption && <div>Remove</div>}</td>
          </tr>

          {props.selectedOptions.map((selectedOption: any, key: number) => {
            const selectOptions = props.selectOptions.map((option: any) => {
              if (option.value === selectedOption) {
                option.isSelected = true;
              }
              return option;
            });

            return (
              <tr key={key}>
                <td />
                <td>
                  <div>
                    <Select options={selectOptions} onSelect={handleOnSelect} />
                  </div>
                </td>
                <td>
                  <div>Remove</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CheckboxMultiselect;
