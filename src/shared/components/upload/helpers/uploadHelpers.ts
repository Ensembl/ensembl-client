import windowService from 'src/services/window-service';

type TransformTo =
  | 'arrayBuffet'
  | 'binaryString'
  | 'dataUrl'
  | 'text';

type FileReaderMethod =
  | 'readAsArrayBuffer'
  | 'readAsBinaryString'
  | 'readAsDataURL'
  | 'readAsText';

const fileReaderErrorMessages: Record<number, string> = {
  1: 'The file can not be found (NOT_FOUND_ERR).',
  2: 'The operation is insecure (SECURITY_ERR).',
  4: 'The I/O read operation failed (NOT_READABLE_ERR).'
};

const isDropEvent = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent): event is React.DragEvent => {
  return event.type === 'drop';
};

const getFilesFromEvent = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
  if (isDropEvent(event)) {
    event.dataTransfer.clearData();
    return event.dataTransfer.files;
  } else {
    return event.target.files
  }
};

const readFromFile = async (file: File, method: FileReaderMethod) => {
  const fileReader = windowService.getFileReader();
  const promise = new Promise((resolve, reject) => {
    fileReader.onload = resolve;
    fileReader.onerror = reject;
    fileReader[method](file);
  });
  return await promise;
};

const fileToArrayBuffer = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as ArrayBuffer | null,
    error: null as string | null
  };
  try {
    result.content = await readFromFile(file, 'readAsArrayBuffer') as ArrayBuffer;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);  
  }
  return result;
};

const fileToBinaryString = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  try {
    result.content = await readFromFile(file, 'readAsBinaryString') as string;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);  
  }
  return result;
};

const fileToDataUrl = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  try {
    result.content = await readFromFile(file, 'readAsDataURL') as string;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);  
  }
  return result;
};

const fileToText = async (file: File) => {
  const result = {
    filename: file.name,
    content: null as string | null,
    error: null as string | null
  };
  try {
    result.content = await readFromFile(file, 'readAsText') as string;
  } catch (error) {
    result.error = getErrorMessage(error as ProgressEvent<FileReader>);  
  }
  return result;
};

const getErrorMessage = (error: ProgressEvent<FileReader>) => {
  const errorCode = (error as ProgressEvent<FileReader>).target?.error?.code as number;
  return fileReaderErrorMessages[errorCode];
}
