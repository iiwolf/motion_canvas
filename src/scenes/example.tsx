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


export default makeScene2D(function* (view) {

  view.fill("#242424");

  const coreHex = createHex(view, 1);
  coreHex().fill("#D83311"),
  yield *all(
    coreHex().absoluteRotation(180, 1),
    coreHex().width(HEX_DELTA, 1),
    coreHex().height(HEX_DELTA, 1),
    coreHex().shadowBlur(60, 1),
  )

  let currSize = HEX_DELTA;
  let hexArray: number[] = [1,2,3,4];
  const logger = useLogger();
  const hexAngles = Array.from(Array(6).keys()).map(x => x * 60);

  for (let i of hexArray) {

    let lineFidelityHex = createHex(view, currSize);

    currSize = HEX_DELTA + HEX_DELTA * i;
    yield* all(
      lineFidelityHex().width(currSize, 1),
      lineFidelityHex().height(currSize, 1),
    );

    let randomAngle = hexAngles[Math.floor(Math.random() * hexAngles.length)];
    let randomLevel = hexArray[Math.floor(Math.random() * i)];
    let squareComponent = createComponentSquare(view, randomAngle, randomLevel);
    
    yield *all(
      squareComponent().position.x(Math.cos(toRadians(randomAngle)) * getCenterDistance(randomLevel), 1),
      squareComponent().position.y(Math.sin(toRadians(randomAngle)) * getCenterDistance(randomLevel), 1),
    );
    
    yield createLineToCore(view, squareComponent());
    
    yield* coreHex().moveToTop();
    yield* squareComponent().moveToTop();

  }

});

function createLineToCore(view: View2D, sq1: Polygon) {
  // let start = sq1.position;
  let start: Vector2 = sq1.position();
  // let line = new LineSegment(start, ORIGIN)
  // view.add(line);
  const line = createRef<Line>();
  view.add(
    <Line
      ref={line}
      points={[start]}
      width={100}
      height={100}
      lineWidth={4}
      stroke={'#fff'}
  />
  )

  return line().points([start, ORIGIN]);
}

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
      // shadowBlur={0}
      shadowColor={"black"}
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

      width={componentSquareSize}
      height={componentSquareSize}
      shadowBlur={30}
      shadowColor={"black"}
      shadowOffsetX={5}
      shadowOffsetY={5}
      sides={4}
      lineWidth={2}
      stroke={'#fff'}
      fill={"#1ba4da"}
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


