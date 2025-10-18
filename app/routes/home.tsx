import { Chessboard } from "components/chessboard";
import { PositionInput } from "components/positionInput";
import { SuccessButton } from "components/successButton";
import type { Graph, Paths } from "models/chessboard";
import type { FieldValidation, PositionDetail } from "models/position";
import { useEffect, useMemo, useState } from "react";
import { ChessboardService } from "services/chessboardService";
import { colors } from "utils/colors";
import { convertSecToMin, createChessboardSquares, getFastestPath, isPositionValid, reorderPosition } from "utils/helper";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Delivery Package" },
  ];
}

export default function Home() {
  const [chessboardPaths, setChessboardPaths] = useState<Paths[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [myChessboard, setMyChessboard] = useState<PositionDetail[]>([]);
  const [dronePosition, setDronePosition] = useState<FieldValidation>({ value: '', error: false });
  const [objectPosition, setObjectPosition] = useState<FieldValidation>({ value: '', error: false });
  const [deliveryPosition, setDeliveryPosition] = useState<FieldValidation>({ value: '', error: false });
  const isDroneValueValid = (droneValue?: string) =>
    isPositionValid(droneValue ?? dronePosition.value, [objectPosition.value, deliveryPosition.value]);
  const isObjectValueValid = (objValue?: string) =>
    isPositionValid(objValue ?? objectPosition.value, [dronePosition.value, deliveryPosition.value]);
  const isDeliveryValueValid = (deliveryValue?: string) =>
    isPositionValid(deliveryValue ?? deliveryPosition.value, [dronePosition.value, objectPosition.value]);
  const fullFilled = useMemo(() => isDroneValueValid() && isObjectValueValid() && isDeliveryValueValid(), [dronePosition, objectPosition, deliveryPosition]);

  useEffect(() => {
    const tempChessboard = createChessboardSquares();
    setMyChessboard([...tempChessboard]);

    const localStoragePaths = localStorage.getItem('paths');
    localStoragePaths && setChessboardPaths([...JSON.parse(localStoragePaths) as Paths[]]);
  }, []);

  useEffect(() => {
    if (dronePosition.value.length === 2) {
      if (!dronePosition.error)
        updateChessboard(dronePosition.value, colors.droneSquare);
      else
        restoreDefaultColor(colors.droneSquare);
    }
  }, [dronePosition]);

  useEffect(() => {
    if (objectPosition.value.length === 2) {
      if (!objectPosition.error)
        updateChessboard(objectPosition.value, colors.objectSquare);
      else
        restoreDefaultColor(colors.objectSquare);
    }
  }, [objectPosition]);

  useEffect(() => {
    if (deliveryPosition.value.length === 2) {
      if (!deliveryPosition.error)
        updateChessboard(deliveryPosition.value, colors.deliverySquare);
      else
        restoreDefaultColor(colors.deliverySquare);
    }
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

  function colorPath(positions: string[], color: string) {
    const tempChessboard = [...myChessboard];

    tempChessboard.forEach(piece => {
      if (positions.includes(piece.position!))
        piece.color = color;
    });

    setMyChessboard([...tempChessboard]);
  }

  function restoreDefaultColor(color?: string) {
    const tempChessboard = [...myChessboard];

    if (color) {
      tempChessboard.forEach(piece => {
        if (piece.color === color)
          piece.color = piece.defaultColor;
      });
    }
    else {
      tempChessboard.forEach(piece => {
        if (piece.color != piece.defaultColor)
          piece.color = piece.defaultColor
      });
    }

    setMyChessboard([...tempChessboard]);
  }

  async function trackTime() {
    try {
      let chessboardGraph: Graph | undefined = undefined;
      chessboardGraph = JSON.parse(localStorage.getItem('chessboardGraph')!) as Graph;

      if (!chessboardGraph) {
        try {
          const graphResp: Graph = await ChessboardService.getGraph();
          chessboardGraph = graphResp;
          localStorage.setItem('chessboardGraph', JSON.stringify(graphResp));
        }
        catch {
          throw 'An error occurred and therefore it is not possible to complete the action.';
        }
      }

      const droneValue = reorderPosition(dronePosition.value);
      const objectValue = reorderPosition(objectPosition.value);
      const deliveryValue = reorderPosition(deliveryPosition.value);

      const firstHalf = getFastestPath(
        chessboardGraph,
        droneValue,
        objectValue);

      const secondHalf = getFastestPath(
        chessboardGraph,
        objectValue,
        deliveryValue);

      const finalPath: Paths = {
        firstPath: { ...firstHalf },
        secondPath: { ...secondHalf },
        totalDistance: firstHalf.distance + secondHalf.distance
      };

      addToChessboardPaths(finalPath);
      cleanInputs();
      restoreDefaultColor();
    }
    catch (error) {
      alert(error);
    }
  }

  function cleanInputs() {
    setDronePosition({ value: '', error: false });
    setObjectPosition({ value: '', error: false });
    setDeliveryPosition({ value: '', error: false });
  }

  function addToChessboardPaths(path: Paths) {
    const temp = [...chessboardPaths];
    temp.unshift(path);

    if (temp.length > 10)
      temp.pop();

    setChessboardPaths([...temp]);
    localStorage.setItem('paths', JSON.stringify(temp));
  }

  function isSelected(currentPath: Paths): boolean {
    return selectedPath === `${currentPath.firstPath.path.join()}${currentPath.secondPath.path.join()}`
  }

  return (
    <div className="uppercase p-5 flex flex-col items-center gap-5">
      <div className="flex flex-row items-center justify-center gap-20">
        <div className="flex flex-col gap-8">
          <PositionInput
            title="drone position"
            value={dronePosition.value}
            description="it is the route starting point"
            placeholder="a1"
            onChangeInput={(value) => setDronePosition({ ...dronePosition, value, error: !isDroneValueValid(value) })}
            color={{ textColor: colors.droneText, descriptionColor: colors.droneDescription }}
            error={dronePosition.error}
          />

          <PositionInput
            title="object pickup position"
            value={objectPosition.value}
            description="place where the drone is going to get the package"
            placeholder="d7"
            onChangeInput={(value) => setObjectPosition({ ...objectPosition, value, error: !isObjectValueValid(value) })}
            color={{ textColor: colors.objectText, descriptionColor: colors.objectDescription }}
            error={objectPosition.error}
          />

          <PositionInput
            title="delivery position"
            value={deliveryPosition.value}
            description="the final step - where the drone will leave the package"
            placeholder="f4"
            onChangeInput={(value) => setDeliveryPosition({ ...deliveryPosition, value, error: !isDeliveryValueValid(value) })}
            color={{ textColor: colors.deliveryText, descriptionColor: colors.deliveryDescription }}
            error={deliveryPosition.error}
          />
        </div>

        <div className="w-70 h-70">
          <Chessboard chessboardPositions={myChessboard} />
        </div>
      </div>

      <div className="w-80 h-15">
        <SuccessButton
          onClick={trackTime}
          disabled={fullFilled}
        >
          Confirm route
        </SuccessButton>
      </div>

      <div className="w-full flex flex-col gap-2">
        {
          chessboardPaths.map(x => (
            <div
              key={x.firstPath.path.join() + x.secondPath.path.join()}
              className={`w-full ${isSelected(x) ? 'border-white' : 'border-gray-600'} border-2 rounded-2xl p-5 text-center flex flex-col items-center gap-1 cursor-pointer`}
              onClick={() => setSelectedPath(`${x.firstPath.path.join()}${x.secondPath.path.join()}`)}
            >
              <label>
                Route time: {convertSecToMin(x.totalDistance)}
                <label className="lowercase">min</label>
              </label>
              <label className={`${colors.firstHalfPath} text-black px-1 rounded-sm w-fit`}>
                {x.firstPath.path.join(' -> ')}
              </label>
              <label className={`${colors.secondHalfPath} text-black px-1 rounded-sm w-fit`}>
                {x.secondPath.path.join(' -> ')}
              </label>
            </div>
          ))
        }
      </div>
    </div>
  );
}
