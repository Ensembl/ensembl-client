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

import { useState, useMemo, type InputEvent, type SubmitEvent } from 'react';

import AutosuggestSearchField from 'src/shared/components/autosuggest-search-field/AutosuggestSearchField';
import Suggestions from './Suggestions';
import { SecondaryButton } from 'src/shared/components/button/Button';

import styles from './AutosuggestSearchField.stories.module.css';

const StandaloneFieldWrapper = () => {
  const [value, setValue] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState<unknown>(null);

  const onChange = (event: InputEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValue(value);
  };

  const onSubmit = (query: string) => {
    setSubmittedSearch(query);
  };

  const onSuggestionSelect = (payload: any) => {
    setSubmittedSearch(payload.data);
  };

  const hasValue = !!value;

  const suggestions = useMemo(() => {
    return hasValue ? <Suggestions /> : null;
  }, [hasValue]);

  return (
    <div>
      <AutosuggestSearchField
        query={value}
        onInput={onChange}
        onSubmit={onSubmit}
        className={styles.autosuggestSearchField}
        suggestions={suggestions}
        onSuggestionSelected={onSuggestionSelect}
        type="search"
        help={'this is a hint'}
      />
      {!!submittedSearch && <Submitted data={submittedSearch} />}
    </div>
  );
};

const FormWrapper = () => {
  const [value, setValue] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState<unknown>(null);

  const onChange = (event: InputEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValue(value);
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector('input');
    const query = input!.value;
    setSubmittedSearch(query);
  };

  const onSuggestionSelect = (payload: any) => {
    setSubmittedSearch(payload.data);
  };

  const hasValue = !!value;

  const suggestions = useMemo(() => {
    return hasValue ? <Suggestions /> : null;
  }, [hasValue]);

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <AutosuggestSearchField
          query={value}
          onInput={onChange}
          suggestions={suggestions}
          onSuggestionSelected={onSuggestionSelect}
          type="search"
          help={'this is a hint'}
        />
        <SecondaryButton>Find</SecondaryButton>
      </form>
      {!!submittedSearch && <Submitted data={submittedSearch} />}
    </div>
  );
};

const Submitted = ({ data }: { data: unknown }) => {
  return (
    <div>
      <div>Submitted:</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export const DefaultStory = {
  name: 'standalone',
  render: () => <StandaloneFieldWrapper />
};

export const FormStory = {
  name: 'in a form element',
  render: () => <FormWrapper />
};

export default {
  title: 'Components/Shared Components/AutosuggestSearchField'
};
