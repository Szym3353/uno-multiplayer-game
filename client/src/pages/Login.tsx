import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { setUser } from "../store/userSlice";
import gql from "graphql-tag";
import useForm from "../hooks/useForm";

const Login = () => {
  const { setFormData, handleSubmit, formErrors } = useForm(
    LOGIN_USER,
    "/",
    setUser
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container">
      <div className="box centered">
        <h4 className="box-header">Login</h4>
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="login-email">Adres e-mail</label>
          <input
            onChange={(e) => handleChange(e)}
            type="email"
            name="email"
            id="login-email"
          />
          <label htmlFor="login-password">Hasło</label>
          <input
            onChange={(e) => handleChange(e)}
            type="password"
            name="password"
            id="login-password"
          />
          <button className="form-submit" type="submit">
            Zaloguj
          </button>
          <Link className="form-link" to="/register">
            Utwórz nowe konto
          </Link>
          {formErrors ? (
            <div className="form-errors">
              {Object.values(formErrors).map((value, index: number) => {
                return (
                  <p className="single-form-error" key={index}>{`${value}`}</p>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default Login;
