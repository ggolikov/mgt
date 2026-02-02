import { useAppStore } from './store';
import { drawBufferFromRing, drawComparePoint, drawCrossLines, drawReflectionPoint, drawCenterLine, drawPointsLine, drawPointsComparison, drawAzimuths } from './mapActions';

export function createMapOptions() {
  return {
    contextmenu: true,
    contextmenuWidth: 200,
    contextmenuItems: [
      {
        text: 'Очистить',
        callback: () => useAppStore.getState().clearAllLayers(),
      },
      {
        text: 'Буфер от Красной площади',
        callback: (e: any) => drawBufferFromRing('Red Square', e),
      },
      {
        text: 'Буфер от Кремля',
        callback: (e: any) => drawBufferFromRing('Kremlin', e),
      },
      {
        text: 'Буфер от Бульварного кольца',
        callback: (e: any) => drawBufferFromRing('Boulevard Ring', e),
      },
      {
        text: 'Буфер от Садового кольца',
        callback: (e: any) => drawBufferFromRing('Garden Ring', e),
      },
      {
        text: 'Буфер от ТТК',
        callback: (e: any) => drawBufferFromRing('Third Transport Ring', e),
      },
      {
        text: 'Буфер от МКАД',
        callback: (e: any) => drawBufferFromRing('MKAD', e),
      },
      {
        text: 'Добавить точку',
        callback: (e: any) => drawComparePoint('from', e),
      },
      {
        text: 'Добавить точку для сравнения',
        callback: (e: any) => drawComparePoint('to', e),
      },
      {
        text: 'Добавить симметричную точку от центра',
        callback: (e: any) => drawReflectionPoint(e),
      },
      {
        text: 'Добавить линии параллели и меридиана',
        callback: (e: any) => drawCrossLines(e),
      },
      {
        text: 'Добавить линию с центром',
        callback: (e: any) => drawCenterLine(e),
      },
      {
        text: 'Добавить сравнение между точками',
        callback: () => drawPointsComparison(),
      },
      {
        text: 'Добавить линию между точками',
        callback: () => drawPointsLine(),
      },
      {
        text: 'Добавить азимуты 22.5',
        callback: () => drawAzimuths([22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]),
      },
      {
        text: 'Добавить азимуты 45',
        callback: () => drawAzimuths([45, 135, 225, 315]),
      },
    ],
  };
}