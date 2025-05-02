import Nav from "./components/Nav.jsx";
import Home from "./components/Home.jsx";
import Projects from "./components/Projects.jsx";
import { navItems } from "./config/config.js";
import About from "./components/About.jsx";
import { useEffect, useState } from "react";
import Contact from "./components/Contact.jsx";
import Wave from "react-wavify";
import ScrollReveal from "./components/ScrollReveal.jsx";

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <>
      <div
        id="home"
        className="flex flex-col justify-center items-center h-screen w-screen bg-slate-900"
      >
        <Nav navItems={navItems} />
        <Home />
      </div>
      <div id="projects" className="w-screen h-fit bg-slate-900">
        <Projects isMobile={isMobile} />
      </div>
      <div className="w-screen bg-slate-900 mb-[14vh] md:mb-[10vh]">
        <div className="rotate-180">
          <Wave
            fill="#1E3A8A"
            paused={false}
            options={{
              height: 20,
              amplitude: 40,
              speed: 0.25,
              points: 3,
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full justify-center items-center">
          <div
            id="about"
            className="w-full md:w-1/2 bg-slate-900 flex justify-center"
          >
            <ScrollReveal threshold={0.2}>
              <About />
            </ScrollReveal>
          </div>
          <div
            id="contacts"
            className="w-full md:w-1/2 flex items-center justify-center bg-slate-900"
          >
            <ScrollReveal threshold={0.3}>
              <Contact />
            </ScrollReveal>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="bg-slate-900 relative">
        <div className="absolute z-0 bottom-0 w-screen ">
          <Wave
            fill="#1E3A8A"
            paused={false}
            options={{
              height: 20,
              amplitude: 40,
              speed: 0.25,
              points: 3,
            }}
          />
        </div>
        <footer className="p-4 z-1 absolute bottom-0 w-screen bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="#" className="hover:underline">
              Roman Augusto
            </a>
            . All Rights Reserved. Made with ReactJs, Kotlin, Postgresql, and
            MongoDb.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a href="#about" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#home" className="mr-4 hover:underline md:mr-6">
                Home
              </a>
            </li>
            <li>
              <a href="#projects" className="mr-4 hover:underline md:mr-6">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#contacts" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}

export default App;
