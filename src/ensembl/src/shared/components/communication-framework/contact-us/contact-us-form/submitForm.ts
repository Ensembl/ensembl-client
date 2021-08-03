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

type FormFieldType = string | File | File[] | null;

type Form = Record<string, FormFieldType>;

export const submitForm = (form: Form) => {
  const formData = buildFormData(form);
  console.log('formData', formData); // eslint-disable-line no-console
};

const buildFormData = (form: Form) => {
  const formData = new FormData(); // note that FormData can only contain unicode strings and blobs, including files
  const formEntries = Object.entries(form);
  for (const [fieldName, value] of formEntries) {
    addToFormData(formData, fieldName, value);
  }
  return formData;
};

const addToFormData = (
  formData: FormData,
  fieldName: string,
  value: FormFieldType
) => {
  if (value === null) {
    return;
  } else if (Array.isArray(value)) {
    for (const item of value) {
      addToFormData(formData, fieldName, item);
    }
  } else if (value instanceof File) {
    formData.append(fieldName, value, value.name);
  } else {
    formData.append(fieldName, value);
  }
};
