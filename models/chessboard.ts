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
  firstPath: ChessboardPath;
  secondPath: ChessboardPath;
  totalDistance: number;
}