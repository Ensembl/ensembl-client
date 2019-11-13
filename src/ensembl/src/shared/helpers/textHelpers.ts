type MeasureTextParams = {
  text: string;
  font: string; // e.g. "italic small-caps bold 12px arial";
};
export const measureText = (params: MeasureTextParams) => {
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvasContext.font = params.font;
  return canvasContext.measureText(params.text);
};
