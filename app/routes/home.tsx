import type { Route } from "./+types/home";
import { Chessboard } from "~/chessboard/chessboard";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Delivery Package" },
  ];
}

interface EventPosition {
  title: string,
  description: string,
  position?: string
}

export default function Home() {
  const markers: EventPosition[] = [
    {
      title: 'drone position',
      description: 'it\'s the starting point of the final route'
    },
    {
      title: 'object pickup position',
      description: 'place where the drone is going to get the package'
    },
    {
      title: 'delivery position',
      description: 'the final step, where the drone will deliver leave the package'
    }
  ];
  const [currentMarker, setCurrentMarker] = useState<EventPosition>(markers[0]);

  function chessboardClick(position: string) {

  }

  return (
    <div className="uppercase justify-items-center grid gap-1">
      <label className="mt-5">
        pick the &nbsp;
        <label className="text-xl font-bold">{currentMarker.title}</label>
      </label>
      <label className="mb-5 ">
        {currentMarker.description}
      </label>
      <Chessboard onClick={chessboardClick} />
    </div>
  );
}
