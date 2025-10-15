import type { ChessboardPath, Graph } from "models/chessboard";
import type { PositionDetail } from "models/position";

export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

export function createChessboardSquares() {
  const chessboardMap: PositionDetail[] = [];
  let color = '';
  for (const row of rows) {
    for (const column of columns) {

      if (columns.indexOf(column) % 2)
        color = row % 2 ? 'bg-white' : 'bg-black';
      else
        color = row % 2 ? 'bg-black' : 'bg-white';

      chessboardMap.push({ column, row, color, defaultColor: color, position: `${column}${row}`.toUpperCase() });
    }
  }

  return chessboardMap;
}

export function isPositionValid(position: string, allocatedPositions?: string[]): boolean {
  if (position.length != 2) return false;
  if (allocatedPositions && allocatedPositions.includes(reorderPosition(position).toLowerCase())) return false;

  if (columns.includes(position.at(0)!.toLowerCase()) && rows.includes(+position.at(1)!)) return true;
  if (columns.includes(position.at(1)!.toLowerCase()) && rows.includes(+position.at(0)!)) return true;

  return false;
}

export function reorderPosition(position: string): string {
  try {
    if (position.length != 2) return position;

    const letter: string = isNaN(+position[0]) ? position[0] : position[1];
    const number: number = +(isNaN(+position[1]) ? position[0] : position[1]);

    return `${letter.toUpperCase()}${number}`;
  }
  catch {
    return position;
  }
}

export function getFastestPath(graph: Graph, startingPoint: string, finalPoint: string): ChessboardPath | null {
  const distances: Record<string, number> = {};
  const visitedPoints: Record<string, string | null> = {};
  const nonvisitedPoints = new Set<string>(Object.keys(graph));

  for (const point in graph) {
    distances[point] = Infinity;
    visitedPoints[point] = null;
  }

  distances[startingPoint] = 0;

  while (nonvisitedPoints.size > 0) {
    let currentPoint: string | null = null;
    let maxDistance = Infinity;

    for (const point of nonvisitedPoints) {
      if (distances[point] < maxDistance) {
        maxDistance = distances[point];
        currentPoint = point;
      }
    }

    if (maxDistance === Infinity) {
      break;
    }

    nonvisitedPoints.delete(currentPoint!);

    if (currentPoint === finalPoint)
      break;

    const neighbours = graph[currentPoint!];
    for (const neighbour in neighbours) {
      const dist = neighbours[neighbour];
      const newDistance = distances[currentPoint!] + dist;

      if (newDistance < distances[neighbour]) {
        distances[neighbour] = newDistance;
        visitedPoints[neighbour] = currentPoint;
      }
    }
  }

  const path: string[] = [];
  let currentStep = finalPoint;

  while (currentStep && visitedPoints[currentStep] !== null) {
    path.unshift(currentStep);
    currentStep = visitedPoints[currentStep]!;
  }

  if (path.length > 0 && currentStep === startingPoint) {
    path.unshift(startingPoint);
    return {
      path: path,
      distance: distances[finalPoint],
    };
  }

  return null;
}