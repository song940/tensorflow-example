import { ready, querySelector as $ } from 'https://lsong.org/scripts/dom.js';
import { requestCamera }             from 'https://lsong.org/scripts/media.js';
import { rect, image, text }         from 'https://lsong.org/scripts/canvas.js';

ready(async () => {
  const video = $('#webcam');
  const canvas = $('#preview');
  const ctx = canvas.getContext('2d');

  const model = await cocoSsd.load();

  const process = async () => {
    image(ctx, video);
    const objects = await model.detect(video);
    for (const obj of objects) {
      const { class: type, score, bbox } = obj;
      const [x, y, width, height] = bbox;
      rect(ctx, { x, y, width, height, color: 'red' });
      text(ctx, `${type} - ${score * 100 | 0}%`, { x, y });
    }
    requestAnimationFrame(process);
  };

  const camera = await requestCamera();
  video.srcObject = camera;
  video.onloadeddata = process;
});