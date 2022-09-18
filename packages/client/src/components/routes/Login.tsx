import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import { LoginRequest } from "@damianopantani/zaliczgmine-server";
import { useFormikField } from "../forms/useFormikField";
import { Input } from "../forms/Input";
import { useSessionStore } from "../../SessionContext";

const initialLoginValues: LoginRequest = { password: "", username: "" };

// TODO: locales

export const Login: React.FC = () => {
  const loginUser = useSessionStore((s) => s.login);
  const handleSubmit = useCallback(
    (form: LoginRequest) => {
      loginUser(form).catch((e) => {
        console.log(e);
      });
    },
    [loginUser]
  );

  return (
    <Formik initialValues={initialLoginValues} onSubmit={handleSubmit}>
      <LoginForm />
    </Formik>
  );
};

const LoginForm = () => {
  const [username, setUsername] = useFormikField<string>("username");
  const [password, setPassword] = useFormikField<string>("password");

  return (
    <Form>
      <Input
        value={username}
        onChange={setUsername}
        placeholder="Nazwa użytkownika"
      />
      <Input
        value={password}
        onChange={setPassword}
        type="password"
        placeholder="Hasło"
      />
      <input type="submit" value="Zaloguj" />
    </Form>
  );
};
