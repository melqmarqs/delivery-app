import type { FieldValidation, PositionDetail } from "models/position";
import { useEffect, useMemo, useState } from "react";
import { colors } from "utils/colors";
import { createChessboardSquares, isPositionValid } from "utils/helper";
import { Chessboard } from "~/chessboard/chessboard";
import { PositionInput } from "~/position/positionInput";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Delivery Package" },
  ];
}

export default function Home() {
  const [myChessboard, setMyChessboard] = useState<PositionDetail[]>([]);
  const [dronePosition, setDronePosition] = useState<FieldValidation>({ value: '', error: false });
  const [objectPosition, setObjectPosition] = useState<FieldValidation>({ value: '', error: false });
  const [deliveryPosition, setDeliveryPosition] = useState<FieldValidation>({ value: '', error: false });
  const fullFilled = useMemo(() => isPositionValid(dronePosition.value) && isPositionValid(objectPosition.value) && isPositionValid(deliveryPosition.value), [dronePosition, objectPosition, deliveryPosition]);

  useEffect(() => {
    const tempChessboard = createChessboardSquares();
    setMyChessboard([...tempChessboard]);
  }, []);

  useEffect(() => {
    if (isPositionValid(dronePosition.value))
      updateChessboard(dronePosition.value, colors.droneSquare);
    else if (dronePosition.value.length === 2)
      restoreDefaultColor(colors.droneSquare);

  }, [dronePosition]);

  useEffect(() => {
    if (isPositionValid(objectPosition.value))
      updateChessboard(objectPosition.value, colors.objectSquare);
    else if (objectPosition.value.length === 2)
      restoreDefaultColor(colors.objectSquare);

  }, [objectPosition]);

  useEffect(() => {
    if (isPositionValid(deliveryPosition.value))
      updateChessboard(deliveryPosition.value, colors.deliverySquare);
    else if (deliveryPosition.value.length === 2)
      restoreDefaultColor(colors.deliverySquare);

  }, [deliveryPosition]);

  function updateChessboard(position: string, color: string) {
    const tempChessboard = [...myChessboard];

    tempChessboard.forEach(piece => {
      if (piece.color === color)
        piece.color = piece.defaultColor;

      if (piece.column.toLowerCase() === position.at(0)!.toLowerCase() && piece.row === +position.at(1)! ||
        piece.column.toLowerCase() === position.at(1)!.toLowerCase() && piece.row === +position.at(0)!)
        piece.color = color;
    });

    setMyChessboard([...tempChessboard]);
  }

  function restoreDefaultColor(color: string) {
    const tempChessboard = [...myChessboard];
    tempChessboard.forEach(piece => {
      if (piece.color === color)
        piece.color = piece.defaultColor;
    });

    setMyChessboard([...tempChessboard]);
  }

  return (
    <div className="uppercase mt-5 flex flex-col items-center gap-5">
      <div className="flex flex-row items-center justify-center gap-20">
        <div className="flex flex-col gap-8">
          <PositionInput
            title="drone position"
            value={dronePosition.value}
            description="it is the route starting point"
            placeholder="a1"
            onChangeInput={(value) => setDronePosition({ ...dronePosition, value })}
            color={{ textColor: colors.droneText, descriptionColor: colors.droneDescription }}
            error={dronePosition.error}
            onBlur={() => setDronePosition({ ...dronePosition, error: !isPositionValid(dronePosition.value) })}
          />

          <PositionInput
            title="object pickup position"
            value={objectPosition.value}
            description="place where the drone is going to get the package"
            placeholder="d7"
            onChangeInput={(value) => setObjectPosition({ ...objectPosition, value })}
            color={{ textColor: colors.objectText, descriptionColor: colors.objectDescription }}
            error={objectPosition.error}
            onBlur={() => setObjectPosition({ ...objectPosition, error: !isPositionValid(objectPosition.value) })}
          />

          <PositionInput
            title="delivery position"
            value={deliveryPosition.value}
            description="the final step - where the drone will leave the package"
            placeholder="f4"
            onChangeInput={(value) => setDeliveryPosition({ ...deliveryPosition, value })}
            color={{ textColor: colors.deliveryText, descriptionColor: colors.deliveryDescription }}
            error={deliveryPosition.error}
            onBlur={() => setDeliveryPosition({ ...deliveryPosition, error: !isPositionValid(deliveryPosition.value) })}
          />
        </div>

        <div className="w-70 h-70">
          <Chessboard chessboardPositions={myChessboard} />
        </div>
      </div>

      <div className="w-80 h-15">
        <button
          className="rounded-xl border-2 size-full border-green-500 bg-green-700 disabled:bg-gray-700 disabled:border-gray-500 disabled:text-gray-400"
          disabled={!fullFilled}
          onClick={() => console.log('click')}
        >
          Confirm route
        </button>
      </div>
    </div>
  );
}
