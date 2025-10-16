export interface Graph {
  [node: string]: {
    [neighbor: string]: number
  }
}

export interface ChessboardPath {
  path: string[];
  distance: number;
}

export interface Paths {
  firstPath: string[];
  secondPath: string[];
  totalDistance: number;
}