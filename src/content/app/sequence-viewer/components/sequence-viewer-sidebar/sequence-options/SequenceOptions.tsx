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

import {
  memo,
  useState,
  useCallback,
  useMemo,
  useId,
  type ReactNode,
  type SubmitEventHandler,
  type FocusEventHandler
} from 'react';
import { useLocation, useNavigate } from 'react-router';

import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';
import SidebarSectionHeading from 'src/shared/components/sidebar-section-heading/SidebarSectionHeading';
import { ImageButton } from 'src/shared/components/image-button/ImageButton';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';

import { SequenceViewerIcon } from 'src/shared/components/app-icon';

import { Status } from 'src/shared/types/status';
import type {
  SequenceBooleanOption as SequenceBooleanOptionType,
  SequenceOptionsSection as SequenceOptionsSectionType,
  SequenceMultiselectOption as SequenceMultiselectOptionType,
  FlankingInfo,
  TranscriptMetadata
} from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';
import type {
  SequenceSettings,
  SequenceOptionValue
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

import styles from './SequenceOptions.module.css';

type AppliedSettings = SequenceSettings['options'];

export const SequenceOptionsSections = ({
  sections,
  appliedSettings,
  onSettingsChange
}: {
  sections: SequenceOptionsSectionType[];
  appliedSettings: AppliedSettings;
  onSettingsChange: (settings: AppliedSettings) => void;
}) => {
  return sections.map((section) => (
    <SequenceOptionsSection
      key={section.label}
      section={section}
      appliedSettings={appliedSettings}
      onSettingsChange={onSettingsChange}
    />
  ));
};

export const SequenceOptionsSection = ({
  section,
  appliedSettings,
  onSettingsChange
}: {
  section: SequenceOptionsSectionType;
  appliedSettings: AppliedSettings;
  onSettingsChange: (settings: AppliedSettings) => void;
}) => {
  const sectionChildren = useMemo(() => {
    return section.children.map((child) => {
      if (child.type === 'checkbox') {
        return (
          <SingleCheckboxOption
            key={child.id}
            option={child}
            appliedSettings={appliedSettings}
            onChange={onSettingsChange}
          />
        );
      } else if (child.type === 'checkbox-group') {
        return (
          <SequenceMultiselectOptions
            key={child.id}
            optionGroup={child}
            appliedSettings={appliedSettings}
            onSettingsChange={onSettingsChange}
          />
        );
      }
    });
  }, [section, appliedSettings, onSettingsChange]);

  return (
    <div>
      <SidebarSectionHeading>{section.label}</SidebarSectionHeading>
      <div className={styles.column}>{sectionChildren}</div>
    </div>
  );
};

export const SequenceMultiselectOptions = ({
  optionGroup,
  onSettingsChange,
  appliedSettings
}: {
  onSettingsChange: (settings: AppliedSettings) => void;
  optionGroup: SequenceMultiselectOptionType;
  appliedSettings: AppliedSettings;
}) => {
  const onChange = useCallback(
    ({
      id,
      value
    }: {
      id: string;
      value: SequenceMultiselectOptionType['values'][number]['value'];
    }) => {
      const storedSettings = appliedSettings[id] as
        SequenceOptionValue[] | undefined;
      let newSettings: SequenceOptionValue[] = [];

      if (storedSettings) {
        if (storedSettings.includes(value)) {
          newSettings = storedSettings.filter((val) => val !== value);
        } else {
          newSettings = [...storedSettings, value];
        }
      } else {
        newSettings.push(value);
      }

      onSettingsChange({
        ...appliedSettings,
        [id]: newSettings
      });
    },
    [onSettingsChange, appliedSettings]
  );

  return optionGroup.values.map((option) => (
    <CheckboxOptionInMultiselect
      key={option.label}
      id={optionGroup.id}
      option={option}
      appliedSettings={appliedSettings}
      onChange={onChange}
    />
  ));
};

export const CheckboxOptionInMultiselect = memo(
  ({
    id,
    option,
    appliedSettings,
    onChange: changeHandlerFromProps
  }: {
    id: string;
    option: SequenceMultiselectOptionType['values'][number];
    appliedSettings: AppliedSettings;
    onChange: (params: {
      id: string;
      value: string | number | boolean;
    }) => void;
  }) => {
    const storedSettings = appliedSettings[id];
    const isChecked = Array.isArray(storedSettings)
      ? storedSettings.includes(option.value)
      : option.checked;

    const onChange = useCallback(() => {
      changeHandlerFromProps({ id, value: option.value });
    }, [changeHandlerFromProps, id, option.value]);

    const checkboxWithLabel = useMemo(() => {
      return (
        <CheckboxWithLabel
          checked={isChecked}
          label={option.label}
          onChange={onChange}
        />
      );
    }, [isChecked, option, onChange]);

    if (option.metadata?.type === 'transcript') {
      return (
        <TranscriptOptionWrapper transcript={option.metadata}>
          {checkboxWithLabel}
        </TranscriptOptionWrapper>
      );
    }

    return checkboxWithLabel;
  }
);

export const TranscriptOptionWrapper = ({
  transcript,
  children
}: {
  transcript: TranscriptMetadata;
  children: ReactNode;
}) => {
  const urlLocation = useLocation();
  const navigate = useNavigate();

  const onTranscriptSequenceViewClick = () => {
    const pathname = urlLocation.pathname;
    const focusParam = `transcript:${transcript.id}`;
    const url = `${pathname}?focus=${focusParam}`;
    navigate(url);
  };

  return (
    <div className={styles.featureWrapper}>
      {children}
      <div className={styles.featureButtons}>
        <ImageButton
          status={Status.DEFAULT}
          className={styles.featureButton}
          description={`Show sequence of transcript ${transcript.id}`}
          image={SequenceViewerIcon}
          onClick={onTranscriptSequenceViewClick}
        />
      </div>
    </div>
  );
};

export const SingleCheckboxOption = ({
  option,
  onChange: changeHandlerFromProps,
  appliedSettings
}: {
  option: SequenceBooleanOptionType;
  appliedSettings: AppliedSettings;
  onChange: (settings: AppliedSettings) => void;
}) => {
  const [isChecked, setIsChecked] = useState(option.checked);

  const onChange = useCallback(
    (isChecked: boolean) => {
      const newSettings = { ...appliedSettings };
      if (isChecked) {
        newSettings[option.id] = option.value;
      } else {
        delete newSettings[option.id];
      }

      changeHandlerFromProps(newSettings);
      setIsChecked(isChecked);
    },
    [changeHandlerFromProps, appliedSettings, option]
  );

  return (
    <CheckboxWithLabel
      checked={isChecked}
      label={option.label}
      onChange={onChange}
    />
  );
};

/*
  Set the defaults
  Check the input (make sure it's numbers)
  Clear the input of punctuation (commas, dots)
*/

export const FlankingSequences = ({
  appliedSettings,
  onSettingsChange,
  flanking
}: {
  flanking: FlankingInfo;
  appliedSettings: AppliedSettings;
  onSettingsChange: (settings: AppliedSettings) => void;
}) => {
  const [upstreamError, setUpstreamError] = useState<string | null>(null);
  const [downstreamError, setDownstreamError] = useState<string | null>(null);
  const upstreamInputId = useId();
  const downstreamInputId = useId();

  const getParsedValues = ({
    upstream,
    downstream
  }: {
    upstream: string;
    downstream: string;
  }) => {
    const parsedResult = parseFlankingSequenceInput({
      inputUpstream: upstream,
      inputDownstream: downstream,
      max: flanking.max
    });

    let isError = false;
    if ('error' in parsedResult.upstream) {
      setUpstreamError(parsedResult.upstream.error);
      isError = true;
    }
    if ('error' in parsedResult.downstream) {
      setDownstreamError(parsedResult.downstream.error);
      isError = true;
    }

    if (isError) {
      return;
    } else {
      if (upstreamError) {
        setUpstreamError(null);
      }
      if (downstreamError) {
        setDownstreamError(null);
      }
    }

    return {
      upstream: (parsedResult.upstream as { value: number }).value,
      downstream: (parsedResult.downstream as { value: number }).value
    };
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const upstreamInputValue = formData.get('flanking-upstream') as string;
    const donwstreamInputValue = formData.get('flanking-downstream') as string;

    const parsedValues = getParsedValues({
      upstream: upstreamInputValue,
      downstream: donwstreamInputValue
    });

    if (!parsedValues) {
      return;
    }

    const upstreamId = flanking.upstream_id;
    const downstreamId = flanking.downstream_id;

    const updatedSettings = {
      ...appliedSettings,
      [upstreamId]: parsedValues.upstream,
      [downstreamId]: parsedValues.downstream
    };

    onSettingsChange(updatedSettings);
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const input = event.target;
    const form = input.closest('form') as HTMLFormElement;
    const formData = new FormData(form);
    const upstreamInputValue = formData.get('flanking-upstream') as string;
    const donwstreamInputValue = formData.get('flanking-downstream') as string;

    // validate input fields as a side effect
    getParsedValues({
      upstream: upstreamInputValue,
      downstream: donwstreamInputValue
    });
  };

  return (
    <>
      <SidebarSectionHeading>Flanking sequences</SidebarSectionHeading>
      <form onSubmit={handleSubmit}>
        <div className={styles.textField}>
          <label htmlFor={upstreamInputId} className={styles.textFieldLabel}>
            5' flanking sequence (upstream)
          </label>
          <ShadedInput
            id={upstreamInputId}
            defaultValue={flanking.default}
            name="flanking-upstream"
            onBlur={onBlur}
            autoComplete="off"
          />
          {upstreamError && <div className={styles.error}>{upstreamError}</div>}
        </div>

        <div className={styles.textField}>
          <label htmlFor={downstreamInputId} className={styles.textFieldLabel}>
            3' flanking sequence (downstream)
          </label>
          <ShadedInput
            id={downstreamInputId}
            defaultValue={flanking.default}
            name="flanking-downstream"
            onBlur={onBlur}
            autoComplete="off"
          />
          {downstreamError && (
            <div className={styles.error}>{downstreamError}</div>
          )}
        </div>

        <PrimaryButton>Apply</PrimaryButton>
      </form>
    </>
  );
};

type InputParseResult =
  | {
      value: number;
    }
  | {
      error: string;
    };

const parseFlankingSequenceInput = ({
  inputUpstream,
  inputDownstream,
  max
}: {
  inputUpstream: string;
  inputDownstream: string;
  max: number;
}) => {
  // remove possible commas or dots in the input
  const cleanedUpstream = inputUpstream.trim().replace(/[,.]/g, '') || '0';
  const cleanedDownstream = inputDownstream.trim().replace(/[,.]/g, '') || '0';

  const numUpstream = parseInt(cleanedUpstream, 10);
  const numDownstream = parseInt(cleanedDownstream, 10);

  let errorUpstream: string | null = null;
  let errorDownstream: string | null = null;

  if (!/^\d+$/.test(cleanedUpstream) || !Number.isSafeInteger(numUpstream)) {
    errorUpstream = 'Invalid input';
  }
  if (
    !/^\d+$/.test(cleanedDownstream) ||
    !Number.isSafeInteger(numDownstream)
  ) {
    errorDownstream = 'Invalid input';
  }
  if (numUpstream > max) {
    errorUpstream = `Flank too long (over ${max}`;
  }
  if (numDownstream > max) {
    errorDownstream = `Flank too long (over ${max}`;
  }

  const upstreamParsedResult: InputParseResult = errorUpstream
    ? { error: errorUpstream }
    : { value: numUpstream };
  const downstreamParsedResult: InputParseResult = errorDownstream
    ? { error: errorDownstream }
    : { value: numDownstream };

  return {
    upstream: upstreamParsedResult,
    downstream: downstreamParsedResult
  };
};
