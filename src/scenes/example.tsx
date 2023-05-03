import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle, Line, Polygon, View2D} from '@motion-canvas/2d/lib/components';
import {createRef} from '@motion-canvas/core/lib/utils';
import {all} from '@motion-canvas/core/lib/flow';
import { cos, sin } from '@motion-canvas/core/lib/tweening';
import {useLogger} from '@motion-canvas/core/lib/utils';
import { Logger } from '@motion-canvas/core';
import { LineSegment } from '@motion-canvas/2d/lib/curves';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { Facet, quickHull } from "@derschmale/tympanum";

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
const ORIGIN = new Vector2(0,0);

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
  // let hex = new Polygon(
  //   x=Math.cos(toRadians(angle)) * getCenterDistance(level)
  //   y=Math.sin(toRadians(angle)) * getCenterDistance(level)
  // )

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

// function createLineBetweenSquares(sq1, sq2) {

// }


function createLineToCore(view: View2D, sq1: Polygon) {
  // let start = sq1.position;
  // const line = createRef<Line>();
  let start: Vector2 = sq1.position();
  let line = new LineSegment(start, ORIGIN)
  view.add(line);
  //   <LineSegmen
  //   ref={line}
  //   start={new Vector2(0,0)}
  //   end={origin.position}
  // />
  // )
}

// export default makeScene2D(function* (view) {

//   view.fill("#242424");

//   const coreHex = createHex(view, HEX_DELTA);
//   let currSize = HEX_DELTA;
//   let hexArray: number[] = [1,2,3,4];
//   const logger = useLogger();
//   const hexAngles = Array.from(Array(6).keys()).map(x => x * 60);

//   for (let i of hexArray) {

//     let lineFidelityHex = createHex(view, currSize);

//     currSize = HEX_DELTA + HEX_DELTA * i;
//     yield* all(
//       lineFidelityHex().width(currSize, 1),
//       lineFidelityHex().height(currSize, 1),
//     );

//     let randomAngle = hexAngles[Math.floor(Math.random() * hexAngles.length)];
//     let randomLevel = hexArray[Math.floor(Math.random() * i)];
//     let squareComponent = createComponentSquare(view, randomAngle, randomLevel);
//     createLineToCore(view, squareComponent);
//   }

// });

function addRandomDot(view: View2D, center: number, size: number, color: string) {
  const hex = createRef<Circle>();
  let x = Math.random() * size - 1/2 * size + center;
  let y = Math.random() * size - 1/2 * size + center;
  view.add(
    <Circle
      ref={hex}
      x={x}
      y={y}
      fill={color}
      width={20}
      height={20}
    />,
  );
    
  return [x, y];
}

function addDot(view: View2D, x: number, y: number, color: string) {
  const hex = createRef<Circle>();
  view.add(
    <Circle
      ref={hex}
      x={x}
      y={y}
      fill={color}
      width={20}
      height={20}
    />,
  );
    
  return [x, y];
}
export default makeScene2D(function* (view) {

  view.fill("#242424");
  let logger = useLogger();

  const points = [];
  let nDots = 500;
  let center = 0;
  let size = 500;
  for (let i = 0; i < nDots; ++i) {  
      let x: number = Math.random() * size - 1/2 * size + center;
      let y: number = Math.random() * size - 1/2 * size + center;
      points[i] = [x, y];
      addDot(view, x, y, 'red');
  }

  // const hull = quickHull(points);
  // logger.debug(hull.toString());
  // let facet: Facet = hull.values().next().value;
  // let testVert = facet.verts.values().next().value;
  // logger.debug(testVert.toString());


  // const points = [];
  // for (let i of Array(nDots)) {
  //   let x: number = Math.random() * size - 1/2 * size + center;
  //   let y: number = Math.random() * size - 1/2 * size + center;
  //   points[i] = [x, y]
  //   addDot(view, x, y, 'red');
  // }

  const hull = quickHull(points);
  // logger.debug(hull.toString());
  // let facet: Facet = hull.values().next().value;
  // let testVert = facet.verts.values().next().value;
  // logger.debug(testVert.toString());

  
  // Plot hull
  for (let facet of hull.values()) {
    let indices = facet.verts.values();
    for (let i of indices){
      let [x, y] = points[i];
      addDot(view, x, y, 'green');
    }
  }

  // for (let i of Array(nDots)) {
  //   let dot = addRandomDot(view, 100, 500, 'blue');
  // }
});