import gql from "graphql-tag";
import React from "react";
import { Link } from "react-router-dom";
import useForm from "../hooks/useForm";
import { setUser } from "../store/userSlice";

const Register = () => {
  const { handleSubmit, formErrors, setFormData } = useForm(
    REGISTER_USER,
    "/",
    setUser
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container">
      <div className="box centered">
        <h4 className="box-header">Rejestracja</h4>
        <form className="form" onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="register-username">Nazwa użytkownika</label>
          <input
            onChange={(e) => handleChange(e)}
            type="text"
            name="username"
            id="register-username"
            max="25"
          />
          <label htmlFor="register-email">Adres e-mail</label>
          <input
            onChange={(e) => handleChange(e)}
            type="email"
            name="email"
            id="register-email"
          />
          <label htmlFor="register-password">Hasło</label>
          <input
            onChange={(e) => handleChange(e)}
            type="password"
            name="password"
            id="register-password"
          />
          <label htmlFor="register-confirmPassword">Potwierdz hasło</label>
          <input
            onChange={(e) => handleChange(e)}
            type="password"
            name="confirmPassword"
            id="register-confirmPassword"
          />
          <button className="form-submit" type="submit">
            Zarejestruj
          </button>
          <Link className="form-link" to="/login">
            Posiadam już konto
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      token
    }
  }
`;

export default Register;
