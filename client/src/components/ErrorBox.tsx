import { ApolloError } from "@apollo/client";
import React from "react";
import useCommon from "../hooks/useCommon";

//CSS
import "../styles/error.css";

type props = {
  errorMessage: string;
  errorDetails: ApolloError;
};

const ErrorBox = ({ errorMessage, errorDetails }: props) => {
  const { navigate } = useCommon();

  return (
    <div className="box centered">
      <h2 className="error-header">Wystąpił błąd</h2>
      <p className="error-label">Opis błędu: </p>
      <p className="error-message">{errorMessage}</p>
      <p className="error-label">Error message: </p>
      <p className="error-message">{errorDetails.message}</p>
      <button
        onClick={() => navigate("/")}
        className="main-button button-style-2 error-button"
      >
        Strona główna
      </button>
    </div>
  );
};

export default ErrorBox;
