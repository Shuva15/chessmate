"use client";

import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useSearchParams } from "next/navigation";

export default function Game() {
  const game = useRef(new Chess()).current;
  const [update, setUpdate] = useState(0);
  const stockfish = useRef(null);
  const searchParams = useSearchParams();

  // Get rating and color from query params
  const rating = Number(searchParams.get("rating")) || 1500;
  let playerColor = searchParams.get("color") || "white";
  // Handle "random" by picking white or black
  if (playerColor === "random") {
    playerColor = Math.random() < 0.5 ? "white" : "black";
  }

  function makeAMove(move) {
    console.log("Making move:", move, "Turn:", game.turn(), "FEN before:", game.fen());
    const result = game.move(move);
    console.log("Result:", result, "FEN after:", game.fen());
    setUpdate((prev) => prev + 1);
    return result;
  }

  function makeBotMove() {
    if (game.isCheckmate() || game.isDraw() || game.moves().length === 0) {
      console.log("Game over, no bot move");
      return;
    }
    if (game.turn() === (playerColor === "white" ? "w" : "b")) {
      console.log("Player’s turn, skipping bot move");
      return;
    }
    console.log("Bot move requested, Turn:", game.turn(), "FEN:", game.fen());
    stockfish.current.postMessage("position fen " + game.fen());
    stockfish.current.postMessage("go movetime 1000");
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    });
    if (move === null) return false;
    setTimeout(makeBotMove, 1200);
    return true;
  }

  useEffect(() => {
    stockfish.current = new Worker("/stockfish.js");
    stockfish.current.postMessage("uci");

    // Set Stockfish skill level (0-20, mapped from 1000-2000)
    const skillLevel = Math.floor((rating - 1000) / 50); // e.g., 1500 -> 10
    stockfish.current.postMessage(`setoption name Skill Level value ${skillLevel}`);

    stockfish.current.onmessage = (event) => {
      console.log("Stockfish says:", event.data);
      if (event.data === "uciok") {
        console.log("Stockfish is ready!");
        if (playerColor === "black") {
          setTimeout(makeBotMove, 1200); // Bot starts if player is Black
        }
      }
      if (event.data.startsWith("bestmove")) {
        const moveStr = event.data.split(" ")[1];
        const move = {
          from: moveStr.slice(0, 2),
          to: moveStr.slice(2, 4),
        };
        console.log("Applying Stockfish move:", move, "Turn:", game.turn());
        makeAMove(move);
      }
    };
    console.log("Stockfish loaded");
    return () => {
      stockfish.current.terminate();
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-lg">
      <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          autoPromoteToQueen={true}
        />
        <div className="mt-4 text-center">
          Playing as: {playerColor}, Bot Rating: {rating}
        </div>
      </div>
    </div>
  );
}
