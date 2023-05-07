import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Circle, Line, Node, Polygon, Rect, Txt, View2D} from '@motion-canvas/2d/lib/components';
import {createRef, Reference} from '@motion-canvas/core/lib/utils';
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
const componentSquareSize = HEX_DELTA * 0.3;
const debugDotSize = 10;
const angleOffset = -45;
const hexRadius = (HEX_DELTA / 2);
const APOTHEM = hexRadius * Math.sqrt(3) / 2
const ORIGIN = new Vector2(0,0);

const FILL_COLOR = "#1D1F1F";
const LINE_COLOR = "#B3B8B3";
const ICE_BLUE = "#5AC1CB";
const ICE_BLUE_DARK = "#4C8B95";

export default makeScene2D(function* (view) {

  // Setup background
  view.fill(FILL_COLOR);
  createDotGrid(view);

  const coreHex = createHex(view, 1);
  coreHex().fill(FILL_COLOR)

  yield *all(
    coreHex().absoluteRotation(330, 1),
    coreHex().width(HEX_DELTA, 1),
    coreHex().height(HEX_DELTA, 1),
    // coreHex().shadowBlur(60, 1),
  )

  let currSize = HEX_DELTA;
  let hexArray: number[] = [1,2,3,4];
  const logger = useLogger();
  const fidelityText: string[] = [
    "Line Fidelity",
    "Low Fidelity",
    "Medium Fidelity",
    "High Fidelity",
  ];

  for (let i of hexArray) {

    let lineFidelityHex = createHex(view, currSize);

    currSize = HEX_DELTA + HEX_DELTA * i;
    yield* all(
      lineFidelityHex().width(currSize, 1),
      lineFidelityHex().height(currSize, 1),
    );
    

    // Add text
    const text = createRef<Txt>();
    view.add(
      <>
        <Rect layout 
          fill={FILL_COLOR}
          y={currSize/2  * Math.sqrt(3) / 2}
          padding={[10, 10, 10, 10]}
        >
          <Txt
            ref={text}
            text={fidelityText[i-1]}
            y={currSize/2  * Math.sqrt(3) / 2}
            fontSize={40}
            // lineHeight={50}
            fontFamily={'JetBrains Mono'}
            fill={'rgba(255, 255, 255, 0.6)'}
            textAlign={'center'}
            alignContent={'center'}
          />
        </Rect>
      </>
    )

  }

  const componentLocations: number[][] = [
    [30, 1],
    [270, 1],
    [330, 1],
    [210, 2],
    [30, 3],
    [270, 3],
    [150, 4],
  ];

  const squareComponents: Reference<Rect>[] = [];
  for (let i = 0; i < componentLocations.length; i++) {
    squareComponents[i] = createComponentSquare(view, componentLocations[i][0], componentLocations[i][1]);
    let line = createLineToCore(view, squareComponents[i]());
  }

  // Move to top
  for (let square of squareComponents) {
    yield* square().moveToTop();
  }
  yield* coreHex().moveToTop();

  // Add discipline text to outer edge of each sextant
  const disciplineText: string[] = [
    "Thermal",
    "Aerodynamics",
    "Structural",
    "Dynamics",
    "Electromagnetic"
  ];
  const textAngles: number[] = [

  ]
  let distanceToEdge = HEX_DELTA * 3 * Math.sqrt(3) / 2 * 0.9;

  for (let i = 0; i < disciplineText.length; i++) {
    // Add text
    const text = createRef<Txt>();
    view.add(
      <>
        <Rect layout 
          fill={FILL_COLOR}
          x={Math.cos(toRadians(i * 60 + 150)) * distanceToEdge}
          y={Math.sin(toRadians(i * 60 + 150)) * distanceToEdge}
          rotation={i * 60 + 30 * 2 + ([1,2,3].includes(i) ? 180 : 0) }
          padding={[10, 10, 10, 10]}
        >
          <Txt
            ref={text}
            text={disciplineText[i]}
            y={currSize/2  * Math.sqrt(3) / 2}
            fontSize={50}
            // lineHeight={50}
            fontFamily={'JetBrains Mono'}
            fill={'rgba(255, 255, 255, 0.6)'}
            textAlign={'center'}
            alignContent={'center'}
          />
        </Rect>
      </>
    )
  }
});


function createLineToCore(view: View2D, sq1: Rect) {
  // let start = sq1.position;
  let start: Vector2 = sq1.position();
  // let line = new LineSegment(start, ORIGIN)
  // view.add(line);
  const line = createRef<Line>();
  view.add(
    <Line
      ref={line}
      points={[start, ORIGIN]}
      lineWidth={2}
      stroke={ICE_BLUE}
  />
  )

  return line();
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
      sides={6}
      lineWidth={4}
      rotation={30}
      stroke={LINE_COLOR}
    />,
  );
    
  return hex;
}

function createComponentSquare(view: View2D, angle: number, level: number) {
  const hex = createRef<Rect>();
  view.add(
    <Rect
      ref={hex}
      x={Math.cos(toRadians(angle)) * getCenterDistance(level)}
      y={Math.sin(toRadians(angle)) * getCenterDistance(level)}
      width={componentSquareSize}
      height={componentSquareSize}
      // shadowBlur={30}
      // shadowColor={"black"}
      // shadowOffsetX={5}
      // shadowOffsetY={5}
      lineWidth={5}
      stroke={ICE_BLUE_DARK}
      fill={FILL_COLOR}
      radius={20}
      rotation={angle}
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

function linspace(startValue: number, stopValue: number, cardinality: number) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function createDotGrid(view: View2D) {
  let width = view.width();
  let height = view.height();
  const nDots = 20;
  const spacing = width / nDots;
  const offset = spacing / 2;
  const xLocs = linspace(-width / 2 + offset, width / 2 - offset, nDots);
  const yLocs = linspace(-height / 2 + offset, height / 2 - offset, nDots);
  for (let x of xLocs) {
    for (let y of yLocs) {
      createDot(view, x, y, LINE_COLOR, 5);

      // // Add pluses
      // let plusSpacing = spacing * 0.05;
      // let plusLength = spacing * 0.1;
      // createLine(view, new Vector2(x + plusSpacing, y), new Vector2(x + plusLength, y));
      // createLine(view, new Vector2(x - plusSpacing, y), new Vector2(x - plusLength, y));
      // createLine(view, new Vector2(x, y + plusSpacing), new Vector2(x, y + plusLength));
      // createLine(view, new Vector2(x, y - plusSpacing), new Vector2(x, y - plusLength));

    }
  }
}

function createLine(view: View2D, start: Vector2, end: Vector2) {
  // let start = sq1.position;
  // let line = new LineSegment(start, ORIGIN)
  // view.add(line);
  const line = createRef<Line>();
  view.add(
    <Line
      ref={line}
      points={[start, end]}
      opacity={0.25}
      lineWidth={2}
      stroke={LINE_COLOR}
  />
  )

  return line;
}

function createDot(view: View2D, x: number, y:number, color: string, size: number) {
  const hex = createRef<Circle>();
  view.add(
    <Circle
      ref={hex}
      x={x}
      y={y}
      opacity={0.25}
      fill={color}
      width={size}
      height={size}
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


