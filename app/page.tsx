"use client";

import { useEffect, useState } from "react";

const Home = () => {
  const [playerPos, setPlayerPos] = useState<number | undefined>(undefined);
  const [targetPos, setTargetPos] = useState<number | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const disableBoxes = [7, 8, 9, 10, 13, 22, 25, 28];

  useEffect(() => {
    const playerPos = getRandomValidPosition();
    const targetPos = getRandomValidPosition(playerPos);

    setPlayerPos(playerPos);
    setTargetPos(targetPos);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(playerPos - 6);
          break;
        case "ArrowDown":
          movePlayer(playerPos + 6);
          break;
        case "ArrowLeft":
          if (playerPos % 6 !== 0) movePlayer(playerPos - 1);
          break;
        case "ArrowRight":
          if (playerPos % 6 !== 5) movePlayer(playerPos + 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos]);

  const isValidPosition = (pos: number) => {
    return !disableBoxes.includes(pos);
  };

  const getRandomValidPosition = (excludePos?: number) => {
    const validPositions = Array(36)
      .fill(0)
      .map((_, i) => i)
      .filter((pos) => isValidPosition(pos) && pos !== excludePos);

    return validPositions[Math.floor(Math.random() * validPositions.length)];
  };

  const movePlayer = (newPos: number) => {
    if (newPos >= 0 && newPos < 36 && isValidPosition(newPos) && !gameOver) {
      setPlayerPos(newPos);
      if (newPos === targetPos) {
        generateNewTarget(targetPos);
        setScore((prev) => prev + 100);
        generateNewTarget(newPos);
      }
    }
  };

  const generateNewTarget = (currentPlayerPos: number) => {
    const newTargetPos = getRandomValidPosition(currentPlayerPos);
    setTargetPos(newTargetPos);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-10 bg-amber-100">
      <div className="flex flex-col items-center justify-center h-[740px] aspect-[151/304] relative">
        <div
          style={{ width: "calc(100% - 24px)", height: "calc(100% - 24px)" }}
          className="bg-red-900 rounded-[60px] absolute top-3 left-3"
        ></div>
        <img
          src="/assets/iphone-16-portrait.png"
          height={304}
          width={151}
          alt="Iphone 16"
          className="h-full w-full absolute bottom-0 left-0 right-0"
        />
        <div className="flex flex-col items-center justify-center w-full h-full p-6 relative">
          <div className="flex flex-col items-center justify-start w-full h-full rounded-[2.5rem] py-8">
            <div className="grid grid-cols-6 w-full px-6 mt-6">
              {Array(36)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`w-full aspect-square border-[1px]  ${
                      disableBoxes.includes(index)
                        ? "bg-red-900 border-red-900"
                        : index === playerPos
                        ? "bg-blue-500 border-black"
                        : index === targetPos
                        ? "bg-yellow-400 border-black"
                        : "bg-white border-black"
                    }`}
                  ></div>
                ))}
            </div>
            <div className="flex flex-row justify-between w-full text-xl font-bold text-white px-6 mt-2">
              <div>
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </div>
              <div>Total: {score}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-1/2 mt-auto">
              <div></div>
              <button
                onClick={() => movePlayer(playerPos - 6)}
                className="flex items-center justify-center w-full h-8 rounded-md bg-gray-400 shadow-lg active:scale-90 transition-all duration-300"
              >
                <img
                  src="/assets/chevron-up-svgrepo-com.svg"
                  alt="chevron up"
                  className="w-auto h-5"
                />
              </button>
              <div></div>
              <button
                onClick={() => playerPos % 6 !== 0 && movePlayer(playerPos - 1)}
                className="flex items-center justify-center w-full h-8 rounded-md bg-gray-400 shadow-lg active:scale-90 transition-all duration-300"
              >
                <img
                  src="/assets/chevron-up-svgrepo-com.svg"
                  alt="chevron left"
                  className="w-auto h-5 -rotate-90"
                />
              </button>
              <div></div>
              <button
                onClick={() => playerPos % 6 !== 5 && movePlayer(playerPos + 1)}
                className="flex items-center justify-center w-full h-8 rounded-md bg-gray-400 shadow-lg active:scale-90 transition-all duration-300"
              >
                <img
                  src="/assets/chevron-up-svgrepo-com.svg"
                  alt="chevron right"
                  className="w-auto h-5 rotate-90"
                />
              </button>
              <div></div>
              <button
                onClick={() => movePlayer(playerPos + 6)}
                className="flex items-center justify-center w-full h-8 rounded-md bg-gray-400 shadow-lg active:scale-90 transition-all duration-300"
              >
                <img
                  src="/assets/chevron-up-svgrepo-com.svg"
                  alt="chevron down"
                  className="w-auto h-5 rotate-180"
                />
              </button>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-72 p-4 shadow-lg transform transition-all">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your points: {score}
              </h3>
              <button
                onClick={handleRetry}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg 
                  hover:bg-green-400 transition-colors duration-200 font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
