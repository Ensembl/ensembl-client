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

import { useEffect, useRef, useContext } from 'react';

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

  const stateRef = useRef<typeof currentState>(currentState);
  stateRef.current = currentState; // <-- to be able to save the latest state despite the closures

  useEffect(() => {
    // recover form state from the storage
    indexedDB.get(STORE_NAME, formName).then((savedState) => {
      if (savedState) {
        updateState(savedState);
      }
    });
  }, []);

  useEffect(() => {
    // save the form before user refreshes or closes the tab
    window.addEventListener('beforeunload', saveFormState);

    return () => {
      window.removeEventListener('beforeunload', saveFormState);
      saveFormState(); // <-- also save the form on every unmount
    };
  }, []);

  const isEmptyForm = (state: typeof currentState) => {
    let isEmpty = true;
    for (const value of Object.values(state)) {
      if (Array.isArray(value) && value.length) {
        isEmpty = false;
      } else if (value !== null && value !== '') {
        isEmpty = false;
      }
    }
    return isEmpty;
  };

  const saveFormState = () => {
    // only save the form if it is not empty
    if (isEmptyForm(stateRef.current)) {
      return;
    }
    indexedDB.set('contact-forms', 'initial-form', stateRef.current);
  };

  const clearSavedForm = () => {
    indexedDB.delete(STORE_NAME, formName);
  };

  return {
    clearSavedForm
  };
};

export default useSavedForm;
