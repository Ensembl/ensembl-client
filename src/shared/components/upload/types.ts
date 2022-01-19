type FileReaderMethod =
  | 'readAsArrayBuffer'
  | 'readAsBinaryString'
  | 'readAsDataURL'
  | 'readAsText';


export type Options = {
  readerMethod?: FileReaderMethod;
  allowMultiple?: boolean;
};

type OptionsForArrayBuffer = {
  readerMethod: 'readAsArrayBuffer';
};

type OptionsWithDefinedReaderMethod = {
  readerMethod: FileReaderMethod;
};

type OptionsForMultipleFiles = {
  allowMultiple: true;
};

type FileTransformedToArrayBuffer = {
  filename: string;
  content: ArrayBuffer;
};

type FileTransformedToString = {
  filename: string;
  content: string;
};


type Result<T extends Options> = T extends OptionsForArrayBuffer ?
  ResultForArrayBuffer<T> :
  T extends OptionsWithDefinedReaderMethod ?
    ResultForFileTransformedToString<T> :
    ResultForPlainFile<T>;

type ResultForArrayBuffer<T extends OptionsForArrayBuffer> =
  T extends OptionsForMultipleFiles ?
    FileTransformedToArrayBuffer[] :
    FileTransformedToArrayBuffer;

type ResultForFileTransformedToString<T extends OptionsWithDefinedReaderMethod> =
  T extends OptionsForMultipleFiles ?
    FileTransformedToString[] :
    FileTransformedToString;

type ResultForPlainFile<T extends Options> =
  T extends OptionsForMultipleFiles ?
    File[] :
    File;


/*

// WORKS
const simpleFunction = <T extends Options>(params: T): Result<T> => {
  return {} as unknown as Result<T>; // lying to typescript for simplicity
};

const testVal1 = simpleFunction({ readerMethod: 'readAsArrayBuffer', allowMultiple: true }); // infers FileTransformedToArrayBuffer[]
const testVal2 = simpleFunction({ readerMethod: 'readAsArrayBuffer' }); // infers FileTransformedToArrayBuffer
const testVal3 = simpleFunction({ readerMethod: 'readAsDataURL' }); // infers FileTransformedToString
const testVal4 = simpleFunction({ allowMultiple: true }); // infers File[]


type UseUploadParams<T extends Options> = T & {
  onChange: (result: Result<T>) => void;
};

const useFileUpload = <T extends Options>(params: UseUploadParams<T>) => {
  const result = {} as unknown as Result<T>; // lying to typescript for simplicity
  params.onChange(result);
};

// 
useFileUpload({
  readerMethod: 'readAsArrayBuffer',
  allowMultiple: true,
  onChange: (result: FileTransformedToArrayBuffer[]) => console.log(result)
});


*/
