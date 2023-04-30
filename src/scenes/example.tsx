import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle, Polygon, View2D} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {all} from '@motion-canvas/core/lib/flow';
import { cos, sin } from '@motion-canvas/core/lib/tweening';
import {useLogger} from '@motion-canvas/core/lib/utils';
import { Logger } from '@motion-canvas/core';

// function createPolygons(view: View2D, nHexes: number){

//   let hexArray = Polygon[];
//   // [
//   //   createRef<Polygon>();
//   // ];
//   // view.add(
//   //   <Polygon
//   // )
// }

const HEX_DELTA: number = 400;
const componentSquareSize = HEX_DELTA * 0.4;
const debugDotSize = 10;
const angleOffset = -45;
const hexRadius = (HEX_DELTA / 2);
const APOTHEM = hexRadius * Math.sqrt(3) / 2
function toRadians (angle: number) {
  return angle * (Math.PI / 180);
}

function createHex(view: View2D, size: number) {
  const hex = createRef<Polygon>();

  view.add(
    <Polygon
      ref={hex}
      width={size}
      height={size}
      sides={6}
      lineWidth={4}
      stroke={'#fff'}
    />,
  );
    
  return hex;
}

function createComponentSquare(view: View2D, angle: number, level: number) {
  const hex = createRef<Polygon>();
  view.add(
    <Polygon
      ref={hex}
      x={Math.cos(toRadians(angle)) * getCenterDistance(level)}
      y={Math.sin(toRadians(angle)) * getCenterDistance(level)}
      width={componentSquareSize}
      height={componentSquareSize}
      sides={4}
      lineWidth={4}
      stroke={'#fff'}
      rotation={angle - angleOffset}
    />,
  );
    
  return hex;
}

function createDebugDot(view: View2D, angle: number, h: number) {
  const hex = createRef<Circle>();
  view.add(
    <Circle
      ref={hex}
      x={Math.cos(toRadians(angle)) * h}
      y={Math.sin(toRadians(angle)) * h}
      fill='red'
      width={debugDotSize}
      height={debugDotSize}
    />,
  );
    
  return hex;
}

function createDot(view: View2D, x: number, y:number) {
  const hex = createRef<Circle>();
  view.add(
    <Circle
      ref={hex}
      x={x}
      y={y}
      fill={'red'}
      lineWidth={4}
      width={debugDotSize}
      height={debugDotSize}
    />,
  );
    
  return hex;
}

function createCircle(view: View2D) {
  const hex = createRef<Circle>();
  view.add(
    <Circle
      ref={hex}
      width={HEX_DELTA}
      height={HEX_DELTA}
      lineWidth={1}
      stroke={'red'}
    />,
  );
    
  return hex;
}

function getCenterDistance(level: number) {
  return APOTHEM * (level + 0.5);
}

export default makeScene2D(function* (view) {

  view.fill("#242424");


  const coreHex = createHex(view, HEX_DELTA);
  let currSize = HEX_DELTA;
  let hexArray: number[] = [1,2,3,4];
  let angleRange = Array.from(Array(6).keys()).map(x => x * 60);
  const logger = useLogger();

  let squareComponent = createComponentSquare(view, -60, 1);
  squareComponent = createComponentSquare(view, 60, 1);
  squareComponent = createComponentSquare(view, 60, 2);

  for (let i of hexArray) {

    let lineFidelityHex = createHex(view, currSize);

    currSize = HEX_DELTA + HEX_DELTA * i;
    yield* all(
      lineFidelityHex().width(currSize, 1),
      lineFidelityHex().height(currSize, 1),
    );
  }

});