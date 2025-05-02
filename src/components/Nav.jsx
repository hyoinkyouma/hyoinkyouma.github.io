import React, { useState } from "react";

const Nav = (props) => {
  const [isMenu, setIsMenu] = useState(false);

  const handMenuClick = () => {
    setIsMenu(!isMenu);
  };

  const items = () => {
    return props.navItems.map((item, key) => {
      return (
        <React.Fragment key={key}>
          <li>
            <a href={item.id}>{item.name}</a>
          </li>
        </React.Fragment>
      );
    });
  };
  return (
    <>
      <nav className="xl:w-[75%] absolute top-0 px-4 py-5 h-fit grid grid-row-2 grid-cols-2 items-center justify-items-end w-screen">
        <h1 className="text-white text-2xl justify-self-start">
          Roman Augusto
        </h1>
        <ul className="text-white text-xl md:flex gap-2 hidden">{items()}</ul>
        <div className="md:hidden w-fit h-fit" onClick={handMenuClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <div
          className={`w-fit h-fit p-1 col-span-2 hover:cursor-pointer transition-opacity ${
            isMenu ? "flex" : "hidden opacity-0"
          }`}
        >
          <ul className="text-white z-20 right-5 absolute transition-opacity flex-col items-start text-right ">
            {items()}
          </ul>
        </div>
      </nav>
      {isMenu && (
        <div
          className={`z-10 fixed h-screen w-screen bg-black opacity-0`}
          onClick={() => {
            setIsMenu(false);
          }}
        ></div>
      )}
    </>
  );
};

export default Nav;
