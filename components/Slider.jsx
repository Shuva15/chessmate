"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider() {
  return (
    <Box sx={{ width: 450 }}>
      <Slider
        aria-label="Rating"
        defaultValue={1500}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        shiftStep={10}
        step={50}
        marks
        min={1000}
        max={2000}
      />
    </Box>  
  );
}