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

import { useEffect, useRef, useContext, useEffectEvent } from 'react';

import IndexedDBContext from 'src/shared/contexts/IndexedDBContext';

type FormFieldType = string | File | File[] | null;

type Form = Record<string, FormFieldType>;

type Params<S> = {
  formName: string;
  currentState: S;
  updateState: (state: S) => void;
};

type UseSavedForm = <State extends Form>(
  params: Params<State>
) => {
  clearSavedForm: () => void;
};

const STORE_NAME = 'contact-forms'; // storage used to save data of different contact forms

const useSavedForm: UseSavedForm = (params) => {
  const { formName, currentState, updateState } = params;
  const indexedDB = useContext(IndexedDBContext);

  const stateRef = useRef<typeof currentState>(currentState); // <-- to be able to save the latest state despite the closures

  const isEmptyForm = (state: typeof currentState) => {
    let isEmpty = true;
    for (const value of Object.values(state)) {
      if (Array.isArray(value)) {
        if (value.length) {
          isEmpty = false;
        }
      } else if (value !== null && value !== '') {
        isEmpty = false;
      }
    }
    return isEmpty;
  };

  const hasSavedForm = async () => {
    const savedForm = await indexedDB.get(STORE_NAME, formName);
    return Boolean(savedForm);
  };

  const withoutHugeFiles = (state: Form) => {
    // the user isn't allowed to submit files larger than 10MB anyway;
    // so there is no point is saving such files to IndexedDB
    const fileSizeLimit = 10e6;
    const clonedState = { ...state };
    for (const [fieldName, fieldValue] of Object.entries(clonedState)) {
      if (fieldValue instanceof File && fieldValue.size > fileSizeLimit) {
        clonedState[fieldName] = null;
      } else if (Array.isArray(fieldValue)) {
        clonedState[fieldName] = fieldValue.filter(
          (file) => file.size <= fileSizeLimit
        );
      }
    }
    return clonedState;
  };

  const clearSavedForm = () => {
    indexedDB.delete(STORE_NAME, formName);
  };

  const saveFormState = useEffectEvent(async () => {
    // do not save the form if it is currently empty and has not been saved before
    // (if it has been saved, then saving an empty form to overwrite the previously saved one is fine)
    const hasPreviouslySavedForm = await hasSavedForm();
    if (!hasPreviouslySavedForm && isEmptyForm(stateRef.current)) {
      return;
    }
    const formWithoutHugeFiles = withoutHugeFiles(stateRef.current);
    indexedDB.set(STORE_NAME, formName, formWithoutHugeFiles);
  });

  useEffect(() => {
    stateRef.current = currentState;
  });

  useEffect(() => {
    // recover form state from the storage
    indexedDB.get(STORE_NAME, formName).then((savedState) => {
      if (savedState) {
        updateState(savedState);
      }
    });
  }, [indexedDB, formName, updateState]);

  useEffect(() => {
    // save the form before user refreshes or closes the tab
    window.addEventListener('beforeunload', saveFormState);

    return () => {
      window.removeEventListener('beforeunload', saveFormState);
      saveFormState(); // <-- also save the form on every unmount
    };
  }, []);

  return {
    clearSavedForm
  };
};

export default useSavedForm;
