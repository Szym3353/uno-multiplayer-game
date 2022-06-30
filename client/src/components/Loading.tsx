import React from "react";

//CSS
import "../styles/loading.css";

const Loading = () => {
  return (
    <div className="box centered">
      <img className="loading-image" src="/ikona.png" />
      <p className="loading-txt">Ładowanie ...</p>
    </div>
  );
};

export default Loading;
