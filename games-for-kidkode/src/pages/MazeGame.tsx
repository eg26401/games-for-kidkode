import React, { useEffect, useState } from "react";
import "./MazeGame.css";

const MAZE_SIZE = 10; // 10x10 grid

// Define maze layout with obstacles (1s represent obstacles)
const initialMazeLayout: number[][] = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
];

interface TurtlePosition {
  x: number;
  y: number;
  direction: "EAST" | "WEST" | "NORTH" | "SOUTH";
}

interface MazeGameProps {
  commands: ("MOVE_FORWARD" | "TURN_LEFT" | "TURN_RIGHT")[];
}

const MazeGame: React.FC<MazeGameProps> = ({ commands }) => {
  const [turtlePosition, setTurtlePosition] = useState<TurtlePosition>({
    x: 0,
    y: 0,
    direction: "EAST",
  });

  useEffect(() => {
    const executeCommands = () => {
      let newPosition = { ...turtlePosition };
      commands.forEach((command) => {
        if (command === "MOVE_FORWARD") {
          const nextPosition = getNextPosition(newPosition);
          if (isPositionValid(nextPosition)) {
            newPosition = nextPosition;
          }
        } else if (command === "TURN_LEFT") {
          newPosition.direction = turnLeft(newPosition.direction);
        } else if (command === "TURN_RIGHT") {
          newPosition.direction = turnRight(newPosition.direction);
        }
      });
      setTurtlePosition(newPosition);
    };

    executeCommands();
  }, [commands]);

  const getNextPosition = (position: TurtlePosition): TurtlePosition => {
    const { x, y, direction } = position;
    if (direction === "EAST") return { ...position, x: x + 1 };
    if (direction === "WEST") return { ...position, x: x - 1 };
    if (direction === "NORTH") return { ...position, y: y - 1 };
    if (direction === "SOUTH") return { ...position, y: y + 1 };
    return position;
  };

  const isPositionValid = ({ x, y }: TurtlePosition): boolean => {
    return (
      x >= 0 &&
      x < MAZE_SIZE &&
      y >= 0 &&
      y < MAZE_SIZE &&
      initialMazeLayout[y][x] === 0
    );
  };

  const turnLeft = (
    direction: TurtlePosition["direction"]
  ): TurtlePosition["direction"] => {
    const directions: Record<
      TurtlePosition["direction"],
      TurtlePosition["direction"]
    > = {
      EAST: "NORTH",
      NORTH: "WEST",
      WEST: "SOUTH",
      SOUTH: "EAST",
    };
    return directions[direction];
  };

  const turnRight = (
    direction: TurtlePosition["direction"]
  ): TurtlePosition["direction"] => {
    const directions: Record<
      TurtlePosition["direction"],
      TurtlePosition["direction"]
    > = {
      EAST: "SOUTH",
      SOUTH: "WEST",
      WEST: "NORTH",
      NORTH: "EAST",
    };
    return directions[direction];
  };

  const getRotation = (direction: TurtlePosition["direction"]): number => {
    switch (direction) {
      case "EAST":
        return 0;
      case "SOUTH":
        return 90;
      case "WEST":
        return 180;
      case "NORTH":
        return 270;
      default:
        return 0;
    }
  };

  return (
    <div className="maze">
      {initialMazeLayout.map((row, rowIndex) => (
        <div className="maze-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div className="maze-cell" key={colIndex}>
              {cell === 1 && <div className="obstacle" />}{" "}
              {/* Render obstacle */}
              {turtlePosition.x === colIndex &&
                turtlePosition.y === rowIndex && (
                  <img
                    src="/turtle.png"
                    alt="Turtle"
                    className={`turtle turtle-${turtlePosition.direction.toLowerCase()}`}
                    style={{
                      transform: `rotate(${getRotation(
                        turtlePosition.direction
                      )}deg)`,
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MazeGame;
