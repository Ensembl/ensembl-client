const downloadAsFile = (
  content: string | string[],
  fileName: string,
  options: { type: string }
) => {
  if (typeof content === 'string') {
    content = [content];
  }
  const blob = new Blob(content, options);
  const blobUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = fileName;
  downloadLink.click();
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 100);
};

export default downloadAsFile;
