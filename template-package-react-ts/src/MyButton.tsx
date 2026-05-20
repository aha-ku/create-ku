import React, { useState } from "react";
import style from "./style.module.css";

interface MyButtonProps {
  type?: "primary";
}

export const MyButton: React.FC<MyButtonProps> = ({ type }) => {
  const [count, setCount] = useState(0);
  return (
    <button className={style.myButton} onClick={() => setCount(count + 1)}>
      my button
      <br /> type: {type}
      <br /> count: {count}
    </button>
  );
};
