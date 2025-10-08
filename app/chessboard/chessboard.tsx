interface ChessboardParams {
  onClick: (position: string) => void
}

export function Chessboard(params: ChessboardParams) {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const chessboardSize = 8;

  function getChessboardBackground(letter: string, number: number) {
    const myValue = letter[0];
    const letterIndex = letters.indexOf(myValue);
    if (letterIndex % 2)
      return number % 2 ? 'bg-black' : 'bg-white'
    else
      return number % 2 ? 'bg-white' : 'bg-black'
  }

  return (
    <div className="grid grid-cols-8 grid-rows-8 border-4 w-80 h-80">
      {
        letters.map(letter =>
          Array.from({ length: chessboardSize }, (_, index) => (
            <div
              key={`${letter}${index}`}
              className={getChessboardBackground(letter, index) + ` cursor-pointer hover:bg-sky-700`}
            >
            </div>
          ))
        )
      }
    </div>
  )
}