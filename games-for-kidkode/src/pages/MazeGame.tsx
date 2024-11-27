import React, { useState } from "react";
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

const validDirections = ["EAST", "WEST", "NORTH", "SOUTH"] as const;
type Direction = (typeof validDirections)[number];

interface TurtlePosition {
  x: number;
  y: number;
  direction: Direction;
}

const MazeGame: React.FC = () => {
  const [turtlePosition, setTurtlePosition] = useState<TurtlePosition>({
    x: 0,
    y: 0,
    direction: "EAST",
  });

  const [commands, setCommands] = useState<
    { direction: Direction; steps: number }[]
  >([{ direction: "EAST", steps: 1 }]);

  const addCommand = () => {
    setCommands([...commands, { direction: "EAST", steps: 1 }]);
  };

  const handleDirectionChange = (index: number, newDirection: string) => {
    if (validDirections.includes(newDirection as Direction)) {
      const updatedCommands = [...commands];
      updatedCommands[index].direction = newDirection as Direction;
      setCommands(updatedCommands);
    }
  };

  const handleStepsChange = (index: number, newSteps: number) => {
    const updatedCommands = [...commands];
    updatedCommands[index].steps = newSteps;
    setCommands(updatedCommands);
  };

  const executeCommands = () => {
    let newPosition = { ...turtlePosition };
    commands.forEach((command) => {
      for (let i = 0; i < command.steps; i++) {
        const nextPosition = getNextPosition(newPosition, command.direction);
        if (isPositionValid(nextPosition)) {
          newPosition = nextPosition;
        } else {
          break; // Stop if the next move is invalid
        }
      }
    });
    setTurtlePosition(newPosition);
  };

  const getNextPosition = (
    position: TurtlePosition,
    direction: Direction
  ): TurtlePosition => {
    const { x, y } = position;
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

  const getRotation = (direction: Direction): number => {
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
    <div>
      <div className="maze">
        {initialMazeLayout.map((row, rowIndex) => (
          <div className="maze-row" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div className="maze-cell" key={colIndex}>
                {cell === 1 && <div className="obstacle" />}
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

      <div className="commands-section">
        {commands.map((command, index) => (
          <div key={index} className="command">
            <select
              value={command.direction}
              onChange={(e) =>
                handleDirectionChange(index, e.target.value as string)
              }
            >
              {validDirections.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={command.steps}
              onChange={(e) =>
                handleStepsChange(index, parseInt(e.target.value, 10))
              }
            />
          </div>
        ))}
        <button onClick={addCommand}>Add Command</button>
        <button onClick={executeCommands}>Execute Commands</button>
      </div>
    </div>
  );
};

export default MazeGame;
