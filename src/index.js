import "./style.css"
import { Canvas, Circle, Matrix, Vector, VectorArrow } from 'vect-js';
import chroma from 'chroma-js';

window.addEventListener('load', onLoad);
document.getElementById('controls-btn').addEventListener('click', onControlsBtnClick);
document.getElementById('rerender-btn').addEventListener('click', onRerender);

let vect;
let controlsOpen = false;
let velocityX0 = 'Math.sin(position.x + position.y + time)';
let velocityY0 = 'Math.sin(position.x + time) + Math.cos(time)';
window.velocityX = velocityX0;
window.velocityY = velocityY0;

function onControlsBtnClick () {
  if (controlsOpen) {
    document.getElementById('controls-container').classList.remove('float-in');
    document.querySelector(('#controls-btn img')).setAttribute('src', 'gear.svg');
    controlsOpen = false;
  } else {
    document.getElementById('controls-container').classList.add('float-in');
    document.querySelector(('#controls-btn img')).setAttribute('src', 'close.svg');
    controlsOpen = true;
  }
}

function onRerender () {
  let vx = document.getElementById('vectorX').value;
  if (isValidEquation(vx)) velocityX = vx;
  else return alert('Invalid vx');
  let vy = document.getElementById('vectorY').value;
  if (isValidEquation(vy)) velocityY = vy;
  else return alert('Invalid vy');

  // TODO: replace with vect.destroy() in next patch
  vect.stopRender();
  vect.container.removeChild(vect.ctx.canvas);
  vect = null;

  onLoad();
}

function isValidEquation (input) {
  let position = {x: 0, y: 0};
  let time = 0;
  try {
    eval(input);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}


function onLoad () {
  document.getElementById('vectorX').value = velocityX;
  document.getElementById('vectorY').value = velocityY;

  vect = new Canvas({
    container: document.getElementById('render-container'),
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
  });
  const maxSpan = vect.getMax();
  const diff = 50;

  for (let y = maxSpan.y - diff; y > -maxSpan.y; y -= diff) {
    for (let x = maxSpan.x - diff; x > -maxSpan.x + diff; x -= diff) {
      let p = new Vector([x, y]);
      let v = new Vector([Math.cos(x) * 30, Math.sin(y) * 30]);
      let s = new VectorArrow(p, v);

      s.onUpdate = function (time) {
        let position = this.start;
        let s = new Vector([eval(velocityX), eval(velocityY)]);
        this.vector = this.vector.add(s);
        this.renderVector = this.vector.scalarProduct(Math.pow(this.vector.abs(), -1) * 30);
        this.color = chroma(this.vector.abs(), 1, 0.6, 'hsl').desaturate(0.5).hex();
      };

      vect.addShape(s);
    }
  }

  vect.onUpdate = function () {
    this.transform(new Matrix([[0.9999, 0], [0, 0.9999]]));
  };

}