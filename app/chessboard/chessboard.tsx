import { type PositionDetail } from "models/position";
import { columns, rows } from "utils/helper";

interface ChessboardParams {
  chessboardPositions: PositionDetail[]
}

export function Chessboard(params: ChessboardParams) {
  return (
    <div className="">
      <div className="flex gap-1">
        <div className="grid grid-rows-8 grid-cols-1">
          {
            rows.map(row => (
              <div key={row}>
                {row}
              </div>
            ))
          }
          <div>&nbsp;</div>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-rows-8 grid-cols-8 border-4 size-60">
            {
              params.chessboardPositions.map(piece => (
                <div
                  key={`${piece.column}${piece.row}`}
                  className={`${piece.color}`}
                >
                </div>
              ))
            }
          </div>
          <div className="grid grid-rows-1 grid-cols-8 text-center">
            {
              columns.map(column => (
                <div key={column}>
                  {column.toUpperCase()}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}