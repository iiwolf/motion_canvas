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

const startingHexSize: number = 200;
const hexDelta: number = 200;
const componentSquareSize = hexDelta * 0.4;
const debugDotSize = 10;
const angleOffset = -45;
const hexRadius = (hexDelta / 2);
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
      width={startingHexSize}
      height={startingHexSize}
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


  const coreHex = createHex(view, startingHexSize);
  let currSize = startingHexSize;
  let hexArray: number[] = [1,2,3,4];
  // let squareComponent = createComponentSquare(view, -60);
  let angleRange = Array.from(Array(6).keys()).map(x => x * 60);

  // let origin = createDot(view, 0, 0);
  // let originCircle = createCircle(view);
  // let debugDot = createDebugDot(view, 0, hexRadius);
  // debugDot = createDebugDot(view, 30, hexRadius);
  // debugDot = createDebugDot(view, 60, hexRadius);
  // debugDot = createDebugDot(view, 90, hexRadius);
  // debugDot = createDebugDot(view, 0, APOTHEM);
  // debugDot = createDebugDot(view, 0, APOTHEM * 1.5);
  const logger = useLogger();
  
  // let APOTHEM = 3 ^ (0.5) / 2 * 
  // debugDot = createDebugDot(view, 0, 100);
  // debugDot = createDebugDot(view, 0, 150);
  // debugDot = createDebugDot(view, 0, 2);
  let squareComponent = createComponentSquare(view, -60, 1);
  squareComponent = createComponentSquare(view, 60, 1);
  squareComponent = createComponentSquare(view, 60, 2);

  // let debugDot2 = createDebugDot(view, 0);

  // squareComponent().absoluteRotation(-angleOffset);
  // yield* squareComponent().absoluteRotation(angleOffset, 1);
  // yield* squareComponent().absoluteRotation(30 + angleOffset, 1);
  // squareComponent().
  // yield* squareComponent().absoluteRotation(45, 1);

  for (let i of hexArray) {

    let lineFidelityHex = createHex(view, currSize);

    currSize = startingHexSize + hexDelta * i;
    yield* all(
      lineFidelityHex().width(currSize, 1),
      lineFidelityHex().height(currSize, 1),
    );
  }


});