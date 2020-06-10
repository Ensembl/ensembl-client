import React, { useState } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';
import { ReactComponent as ChevronUp } from 'static/img/shared/chevron-up.svg';
import RadioGroup, {
  RadioOptions
} from 'src/shared/components/radio-group/RadioGroup';

import styles from './GeneFilter.scss';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

type Props = {
  toggleFilter : () => void ;
  isSidebarOpen : boolean;
};

type OptionValue = string | number | boolean;

const radioData: RadioOptions = [
  { value: 'default', label: 'Default' },
  { value: 'length_longest', label: 'Spliced length: longest - shortest' },
  { value: 'length_shortest', label: 'Spliced length: shortest - longest' }
];

const GeneFilter = (props: Props) => {

  const [isChecked, setChecked] = useState(false);

  const filterBoxClassnames = classNames(
    styles.filterBox,
    { [styles.filterBoxFullWidth]: !props.isSidebarOpen }
  );

  const [selectedRadio, setselectedRadio] = useState<OptionValue>('default');

  const radioChange = (value: OptionValue ) => {
    setselectedRadio(value);
  };

  const checkboxChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterLabel} onClick={props.toggleFilter} >
        Filter & sort
        <ChevronUp  className={styles.chevron}/>
      </div>
      <div className={ filterBoxClassnames }>
        <div className={styles.sort}>
          <div className={styles.header}>Sort by</div>
          <div className={styles.sortContent}>
            <RadioGroup
              {...props}
              classNames={{
                label : styles.label,
                radio : styles.radio,
                radioChecked : styles.radioChecked,
                wrapper : styles.buttonWrapper
              }}
              options={radioData}
              onChange={radioChange}
              selectedOption={selectedRadio}
            />
          </div>
        </div>
        <div className={styles.filter}>
          <div className={styles.header}>Filter by</div>
          <div className={styles.filterContent}>
            <div className={styles.filterColumn}>
            <Checkbox
              classNames={{
                checkboxHolder: styles.buttonWrapper,
                unchecked: styles.checkboxUnchecked,
                checked: styles.checkboxChecked
              }}
              labelClassName={styles.label}
              checked={isChecked}
              label="protein coding"
              onChange={checkboxChange}
            />
            <Checkbox
              classNames={{
                checkboxHolder: styles.buttonWrapper,
                unchecked: styles.checkboxUnchecked,
                checked: styles.checkboxChecked
              }}
              labelClassName={styles.label}
              checked={isChecked}
              label="nonsense medicated decay"
              onChange={checkboxChange}
            />
            <Checkbox
              classNames={{
                checkboxHolder: styles.buttonWrapper,
                unchecked: styles.checkboxUnchecked,
                checked: styles.checkboxChecked
              }}
              labelClassName={styles.label}
              checked={isChecked}
              label="processed transcript"
              onChange={checkboxChange}
            />
            </div>
            <div className={styles.filterColumn}>
              <Checkbox
                classNames={{
                  checkboxHolder: styles.buttonWrapper,
                  unchecked: styles.checkboxUnchecked,
                  checked: styles.checkboxChecked
                }}
                labelClassName={styles.label}
                checked={isChecked}
                label="APRISP1"
                onChange={checkboxChange}
              />
              <Checkbox
                classNames={{
                  checkboxHolder: styles.buttonWrapper,
                  unchecked: styles.checkboxUnchecked,
                  checked: styles.checkboxChecked
                }}
                labelClassName={styles.label}
                checked={isChecked}
                label="no APRIS"
                onChange={checkboxChange}
              />
            </div>
            <div className={styles.filterColumn}>
              <Checkbox
                classNames={{
                  checkboxHolder: styles.buttonWrapper,
                  unchecked: styles.checkboxUnchecked,
                  checked: styles.checkboxChecked
                }}
                labelClassName={styles.label}
                checked={isChecked}
                label="TSL:1"
                onChange={checkboxChange}
              />
              <Checkbox
                classNames={{
                  checkboxHolder: styles.buttonWrapper,
                  unchecked: styles.checkboxUnchecked,
                  checked: styles.checkboxChecked
                }}
                labelClassName={styles.label}
                checked={isChecked}
                label="TSL:2"
                onChange={checkboxChange}
              />
            </div>
          </div>
        </div>
        <CloseIcon className={styles.closeIcon} onClick={props.toggleFilter} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    isSidebarOpen: isEntityViewerSidebarOpen(state),
  };
};

export default connect(mapStateToProps)(GeneFilter);
