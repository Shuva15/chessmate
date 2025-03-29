"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StartButton from "./StartButton";
import ChooseColor from "./ChooseColor";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const FeatureBox = () => {
  const [rating, setRating] = useState("1500");
  const [color, setColor] = useState("white");

  const router = useRouter();

  function changeRating(event, value) {
    setRating(value);
  }

  const handleStartGame = () => {
    router.push(`/game?rating=${rating}&color=${color}`);
  };

  return (
    <div className="bg-teal w-2/4 h-80 m-auto mt-28 rounded-xl shadow-lg flex flex-col items-center justify-between">
      <div className="bg-green-light text-black w-full p-1 text-center rounded-xl font-semibold">
        Play a new game
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="text-black font-semibold mb-2">Choose Your rating</div>
        <div className="flex justify-between mb-1 w-3/4">
          <span className="text-black font-thin text-xs">Rating</span>
          <span className="font-normal text-black text-sm">{rating}</span>
        </div>
        <Box sx={{ width: 450 }}>
          <Slider
            aria-label="Rating"
            defaultValue={1500}
            onChange={changeRating}
            valueLabelDisplay="auto"
            shiftStep={10}
            step={50}
            marks
            min={1000}
            max={2000}
          />
        </Box>
      </div>

      <ChooseColor selectedColor={color} setColor={setColor} />
      <StartButton onClick={handleStartGame} />
    </div>
  );
};

export default FeatureBox;
