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

      chessboardMap.push({ column, row, color, defaultColor: color });
    }
  }

  return chessboardMap;
}

export function isPositionValid(position: string): boolean {
  if (position.length != 2) return false;

  if (columns.includes(position.at(0)!.toLowerCase()) && rows.includes(+position.at(1)!)) return true;
  if (columns.includes(position.at(1)!.toLowerCase()) && rows.includes(+position.at(0)!)) return true;

  return false;
}