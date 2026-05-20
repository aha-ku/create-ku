import React, { useState } from "react";
import style from "./style.module.css";

export const MyButton = ({ type }) => {
  const [count, setCount] = useState(0);
  return (
    <button className={style["my-button"]} onClick={() => setCount(count + 1)}>
      my button
      <br /> type: {type}
      <br /> count: {count}
    </button>
  );
};
