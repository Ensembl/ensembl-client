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

import { useState, useRef, useCallback, useEffect } from 'react';

import { transformFiles, transformFile } from '../helpers/uploadHelpers';

import type { Options, Result, FileUploadParams } from '../types';

const useFileDrop = <O extends Options>(params: FileUploadParams<O>) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const elementRef = useRef<HTMLElement | null>();
  const paramsRef = useRef(params); // to be able to get to the params from within a callback's closure

  // keep count of all dragenter and dragleave events from the component and its children
  // to correctly detect when the dragged file is removed from the component
  // (https://stackoverflow.com/a/21002544/3925302)
  const counterRef = useRef(0);

  useEffect(() => {
    paramsRef.current = params; // update at every rerender
  });

  const onDragEnter = (event: DragEvent) => {
    event.stopPropagation();
    counterRef.current += 1;
    if (event.dataTransfer?.types.some((type) => type === 'Files')) {
      setIsDraggedOver(true);
    }
  };

  const onDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    counterRef.current -= 1;

    if (counterRef.current === 0) {
      setIsDraggedOver(false);
    }
  };

  const onFileDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggedOver(false);
    counterRef.current = 0;

    const params = paramsRef.current; // always use up-to-data params
    const { onUpload, transformTo, allowMultiple } = params;
    const files = getFilesFromDragEvent(event);

    if (!files || !files.length) {
      return; // shouldn't happen, but will make typescript happy
    }

    if (!transformTo) {
      const payload = allowMultiple ? [...files] : files[0];
      onUpload(payload as Result<O>);
    } else {
      const result = allowMultiple
        ? await transformFiles(files, transformTo)
        : await transformFile(files[0], transformTo);
      onUpload(result as Result<O>);
    }
  };

  // FIXME: starting from React 19, callback refs return a cleanup function
  // whereas at some point thereafter, React will stop passing null to the ref function
  const ref = useCallback((element: HTMLElement | null) => {
    if (element === null) {
      // a function ref is called with null when a component that it is referencing unmounts
      elementRef.current?.removeEventListener('dragenter', onDragEnter);
      elementRef.current?.removeEventListener('dragleave', onDragLeave);
      elementRef.current?.removeEventListener('drop', onFileDrop);
      return;
    }

    elementRef.current = element;

    element.addEventListener('dragenter', onDragEnter);
    element.addEventListener('dragleave', onDragLeave);
    element.addEventListener('drop', onFileDrop);
  }, []);

  return {
    ref,
    isDraggedOver
  };
};

// Apparently, dataTransfer.files is an old spec
// (see https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface)
// The modern spec is dataTransfer.items (which aren't necessarily files)
// (see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop#process_the_drop)
const getFilesFromDragEvent = (event: DragEvent): File[] => {
  const { dataTransfer } = event;
  if (!dataTransfer) {
    return [];
  }
  // TODO for the future: consider the behaviour if the user drops a directory rather than a file
  return [...dataTransfer.items]
    .map((item) => item.getAsFile())
    .filter(Boolean) as File[];
};

export default useFileDrop;
