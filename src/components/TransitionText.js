import { useEffect, useState } from "react";

const TransitionText = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300 * props.order);
  });

  return (
    <>
      <h1
        className={`${props.classes} ${
          isVisible ? "transition-opacity" : "opacity-0"
        }`}
      >
        {props.text}
      </h1>
    </>
  );
};

export default TransitionText;
