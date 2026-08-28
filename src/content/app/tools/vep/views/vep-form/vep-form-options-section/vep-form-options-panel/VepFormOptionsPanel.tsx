/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getVepFormParameters } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';
import { updateParameters } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import { groupByCategory } from 'src/content/app/tools/vep/utils/groupByCategory';
import {
  panelSelectionUpdates,
  isPanelFullySelected,
  subOptionToggleUpdates,
  optionToggleUpdates
} from './panelSelectionUpdates';

import OptionHelpText from './OptionHelpText';
import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import TextButton from 'src/shared/components/text-button/TextButton';

import type {
  FormPanel,
  FormPanelOption,
  FormPanelSubOption
} from 'src/content/app/tools/vep/types/vepFormConfig';

import commonStyles from '../VepFormOptionsSection.module.css';
import styles from './VepFormOptionsPanel.module.css';

type Props = {
  panel: FormPanel;
  expandCommand?: { expanded: boolean; nonce: number };
};

/**
 * An option carrying a nested group — the gnomAD / All of Us allele-frequency
 * sources, each with its own ancestry (or subset) matrix. These need more room
 * than a standard 200px option column, so a group of them is laid out in wider
 * columns (see `optionsGridSources`).
 */
const isSourceOption = (option: FormPanelOption) =>
  !!option.sub_options?.some((subOption) => subOption.type === 'group');

const VepFormOptionsPanel = (props: Props) => {
  const { panel, expandCommand } = props;
  const dispatch = useAppDispatch();
  const formParameters = useAppSelector(getVepFormParameters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [customisedSources, setCustomisedSources] = useState<
    Record<string, boolean>
  >({});

  const groups = useMemo(() => groupByCategory(panel.options), [panel.options]);

  const boolValue = (id: string, fallback: boolean) => {
    const value = formParameters[id];
    return value === undefined ? fallback : !!value;
  };

  const hasSelectedOption = useMemo(
    () => panel.options.some((option) => !!formParameters[option.id]),
    [panel.options, formParameters]
  );

  // Auto-expand once when the panel has selected options — e.g. when returning
  // to the form via Edit/rerun, whose restored parameters arrive asynchronously.
  // Only fires once, so the user can collapse it again afterwards.
  const didAutoExpand = useRef(false);
  useEffect(() => {
    if (!didAutoExpand.current && hasSelectedOption) {
      setIsExpanded(true);
      didAutoExpand.current = true;
    }
  }, [hasSelectedOption]);

  // Open/close on the section toggle's command. Keyed on the nonce, not on
  // `expanded`, so clicking the section toggle twice back to the same value
  // still lands — and so a re-render never reopens a panel the user just closed.
  const lastExpandNonce = useRef(expandCommand?.nonce);
  useEffect(() => {
    if (expandCommand && expandCommand.nonce !== lastExpandNonce.current) {
      lastExpandNonce.current = expandCommand.nonce;
      setIsExpanded(expandCommand.expanded);
    }
  }, [expandCommand]);

  const toggleExpanded = () => setIsExpanded((expanded) => !expanded);

  // "Select all" / "Unselect all": one toggle that switches every top-level
  // option in the panel on, or (once they all are) back off. Only shown while
  // the panel is expanded, so it acts on options the user can see.
  const allSelected = useMemo(
    () => isPanelFullySelected(panel, formParameters),
    [panel, formParameters]
  );
  const toggleSelectAll = () =>
    dispatch(updateParameters(panelSelectionUpdates(panel, !allSelected)));

  // renderSubOption and renderOption are mutually recursive (a 'group'
  // sub-option renders nested options, which may themselves have sub-options).
  // Declared as hoisted functions so the forward reference is clean.
  /**
   * Whether a sub-option shows while a source is uncustomised. Only selections
   * are hidden: a setting like the SV overlap cutoff is part of the suggested
   * defaults, not a choice among many, so it always shows.
   */
  function isSuggested(subOption: FormPanelSubOption): boolean {
    if (subOption.type === 'group') {
      return subOption.options.some(isSuggestedOption);
    }
    if (subOption.type === 'boolean') {
      return boolValue(subOption.id, subOption.default);
    }
    return true;
  }

  function isSuggestedOption(option: FormPanelOption): boolean {
    return boolValue(option.id, option.default);
  }

  // `owner` is the top-level option a boolean sub-option belongs to, passed
  // only from the direct-children call site: it is what lets unticking the last
  // sub-option switch the option itself off (see subOptionToggleUpdates).
  function renderSubOption(
    subOption: FormPanelSubOption,
    showAll = true,
    owner?: FormPanelOption
  ) {
    if (subOption.type === 'group') {
      const options = showAll
        ? subOption.options
        : subOption.options.filter(isSuggestedOption);
      if (options.length === 0) {
        return null;
      }
      return (
        <div className={styles.subOptionGroup} key={subOption.label ?? 'group'}>
          {subOption.label && (
            <div className={styles.groupHeading}>{subOption.label}</div>
          )}
          {options.map((option) => renderOption(option, showAll))}
        </div>
      );
    }

    if (subOption.type === 'select') {
      const value = formParameters[subOption.id];
      const currentValue =
        value === undefined ? subOption.default : String(value);
      return (
        <div className={styles.subOptionRow} key={subOption.id}>
          {subOption.label && (
            <span className={styles.subOptionLabel}>{subOption.label}</span>
          )}
          <SimpleSelect
            options={subOption.options}
            value={currentValue}
            className={styles.subOptionSelect}
            onChange={noop}
            onInput={(event) =>
              dispatch(
                updateParameters({ [subOption.id]: event.currentTarget.value })
              )
            }
          />
        </div>
      );
    }

    if (subOption.type === 'number') {
      const value = formParameters[subOption.id];
      const currentValue =
        value === undefined ? subOption.default : Number(value);
      const { min, max } = subOption;
      // Keep the stored value an integer within [min, max]; an empty/invalid
      // entry falls back to the default rather than storing NaN.
      const clamp = (raw: string) => {
        const parsed = Math.trunc(Number(raw));
        let next =
          raw === '' || Number.isNaN(parsed) ? subOption.default : parsed;
        if (min !== undefined) next = Math.max(min, next);
        if (max !== undefined) next = Math.min(max, next);
        return next;
      };
      return (
        <div className={styles.subOptionRow} key={subOption.id}>
          {subOption.label && (
            <span className={styles.subOptionLabel}>{subOption.label}</span>
          )}
          <input
            type="number"
            className={styles.numberInput}
            value={currentValue}
            min={min}
            max={max}
            step={1}
            onChange={(event) =>
              dispatch(
                updateParameters({
                  [subOption.id]: clamp(event.currentTarget.value)
                })
              )
            }
          />
        </div>
      );
    }

    // boolean sub-option
    return (
      <CheckboxWithLabel
        key={subOption.id}
        label={subOption.label ?? subOption.id}
        checked={boolValue(subOption.id, subOption.default)}
        onChange={(isChecked) =>
          dispatch(
            updateParameters(
              owner
                ? subOptionToggleUpdates(
                    owner,
                    subOption.id,
                    isChecked,
                    formParameters
                  )
                : { [subOption.id]: isChecked }
            )
          )
        }
      />
    );
  }

  function renderOption(option: FormPanelOption, showAll = true) {
    const checked = boolValue(option.id, option.default);
    const help = option.help;
    // Controls the "Customise selection" button.
    const isCustomisable = showAll && isSourceOption(option);
    const showChildren = isCustomisable
      ? !!customisedSources[option.id]
      : showAll;
    return (
      <div className={styles.optionCell} key={option.id}>
        <div className={styles.optionHeader}>
          <CheckboxWithLabel
            label={option.label}
            checked={checked}
            onChange={(isChecked) =>
              dispatch(updateParameters(optionToggleUpdates(option, isChecked)))
            }
          />
          {help && (
            <QuestionButton
              helpText={<OptionHelpText help={help} />}
              className={{ inline: styles.helpIcon }}
            />
          )}
        </div>
        {checked && option.sub_options && (
          <div className={styles.childOptions}>
            {option.sub_options
              ?.filter((subOption) => showChildren || isSuggested(subOption))
              .map((subOption) =>
                renderSubOption(subOption, showChildren, option)
              )}
            {isCustomisable && (
              <TextButton
                className={styles.customiseButton}
                onClick={() =>
                  setCustomisedSources((current) => ({
                    ...current,
                    [option.id]: !showChildren
                  }))
                }
              >
                {showChildren ? 'Show fewer' : 'Customise selection'}
              </TextButton>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <FormSection className={styles.panelSection}>
      <div className={commonStyles.sectionTitleContainer}>
        <ShowHide
          label={panel.label}
          isExpanded={isExpanded}
          onClick={toggleExpanded}
        />
        {isExpanded && (
          <TextButton
            onClick={toggleSelectAll}
            className={styles.selectAllButton}
          >
            {allSelected ? 'Unselect all' : 'Select all'}
          </TextButton>
        )}
      </div>
      {isExpanded && (
        <div className={styles.panelBody}>
          {groups.map((group, index) => (
            <div className={styles.group} key={group.category ?? index}>
              {group.category && (
                <div className={styles.groupLabel}>{group.category}</div>
              )}
              <div
                className={classNames(styles.optionsGrid, {
                  // Allele-frequency sources carry whole matrices of their own,
                  // so they get wider columns
                  [styles.optionsGridSources]:
                    group.options.some(isSourceOption)
                })}
              >
                {group.options.map((option) => renderOption(option))}
              </div>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
};

export default VepFormOptionsPanel;
