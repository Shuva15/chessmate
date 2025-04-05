import React from 'react'

const StartButton = (props) => {
  return (
    <button onClick={props.onClick} className='p-4 bg-green-light text-black border-2 border-green-dark rounded-md text-lg font-semibold mb-4 hover:bg-green-dark hover:border-black transition delay-100 duration-200 ease-in-out hover:translate-y-1 hover:scale-100 cursor-pointer'>Start New Game</button>
  )
}

export default StartButton