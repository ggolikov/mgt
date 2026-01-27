import { useAppStore } from './store';
import { drawBufferFromRing, drawComparePoint, drawCrossLines, drawReflectionPoint, drawCenterLine } from './mapActions';

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
    ],
  };
}