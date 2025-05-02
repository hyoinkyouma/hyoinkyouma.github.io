import React from "react";

const About = () => {
  return (
    <>
      <div className="h-fit flex flex-col">
     
        <div className="w-full relative text-white h-fit gap-5 flex flex-col items-center justify-center">
          <h1 className="text-4xl">About</h1>
          <img
            className="w-60 md:w-72 mt-1 drop-shadow-2xl rounded-lg border-orange-400"
            src="https://hyoinkyouma.github.io/img/163293109_1356644491362846_1748712258447566176_n.jpg"
          />
          <div className="flex flex-col justify-center my-5">
            <p className="text-xl w-full max-w-md md:max-w-lg lg:max-w-xl px-4 md:px-0 z-10">
            I'm Roman Cabalum, a software engineer with over three years of hands-on experience in developing robust and scalable applications using Java, Kotlin, JavaScript, and ASP. <br/><br/> Currently, I work at Cambridge University Press & Assessment, where I contribute to building and maintaining high-quality digital solutions that support global education initiatives. <br/><br/> My work spans both frontend and backend development, with a strong focus on clean code, maintainability, and performance. I'm passionate about continuous learning, problem-solving, and creating technology that drives real impact.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
