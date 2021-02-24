import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";

function ButtonLink(props) {
  return (
    <div
      className={
        "btn" +
        (props.transparent ? " btn--transparent" : "") +
        (props.small ? " btn--small" : "") +
        (props.white ? " btn--white" : "")
      }
    >
      <Link to={props.href}
      >
        {props.text}
      </Link>
    </div>
  );
}

export default ButtonLink;
