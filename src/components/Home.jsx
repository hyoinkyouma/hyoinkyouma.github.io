import React, { useState } from "react";
import Wave from "react-wavify";
import TransitionText from "./TransitionText";
import Button from "./Button";

const Home = () => {
  const [waveSpeed, setWaveSpeed] = useState(parseFloat(0.25));
  const waveMod = (modifier = parseFloat(0.5), duration = 2000) => {
    setWaveSpeed(parseFloat(modifier));
    setTimeout(() => {
      setWaveSpeed(parseFloat(0.25));
    }, duration);
  };
  const handleCVButtonClick = () => {
    waveMod(1, 3000);
  };
  const handlePortfolioButtonClick = () => {
    waveMod(1, 3000);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2 items-center h-full justify-center text-white">
        <TransitionText
          text={"Hey, I'm Roman!"}
          order={1}
          classes={"text-4xl"}
        />
        <TransitionText
          text={"A Full Stack Dev"}
          order={2}
          classes={"text-xl text-gray-400"}
        />
        <div className="flex justify-center mt-5 align-center w-fit h-fit gap-3">
          <a
            href="https://docs.google.com/document/d/e/2PACX-1vRZawLv1yV2K__E48n6aVkeJDj83yK69AHYSJiQt2AxRDbyXdzw1djaBPQeNE2tcg/pub"
            target="_blank"
          >
            <Button onClick={handleCVButtonClick} title={"Download CV"} />
          </a>
          <a href="#projects">
            <Button
              onClick={handlePortfolioButtonClick}
              title={"My Portfolio"}
            />
          </a>
        </div>

        <div className="absolute z-10 bottom-[-.6vh] w-screen">
          <Wave
            fill="#1E3A8A"
            paused={false}
            options={{
              height: 20,
              amplitude: 40,
              speed: waveSpeed,
              points: 3,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
