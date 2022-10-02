import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import { LoginRequest } from "@damianopantani/zaliczgmine-server";
import { useFormikField } from "../forms/useFormikField";
import { Input } from "../forms/Input";
import { Button } from "../forms/Button";
import { useSessionStore } from "../../SessionContext";
import styles from "./Login.module.scss";

type Props = {
  isLoading: boolean;
};

const initialLoginValues: LoginRequest = { password: "", username: "" };

export const Login: React.FC = () => {
  const loginUser = useSessionStore((s) => s.login);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (form: LoginRequest) => {
      setLoading(true);
      loginUser(form).catch(() => {
        // TODO: handle errors
        setLoading(false);
      });
    },
    [loginUser]
  );

  return (
    <Formik initialValues={initialLoginValues} onSubmit={handleSubmit}>
      <LoginForm isLoading={isLoading} />
    </Formik>
  );
};

const LoginForm = ({ isLoading }: Props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useFormikField<string>("username");
  const [password, setPassword] = useFormikField<string>("password");

  return (
    <Form className={styles.form}>
      <h1>{t("nav.login")}</h1>
      <div>
        <Input
          value={username}
          onChange={setUsername}
          placeholder={t("form.login.username")}
        />
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          placeholder={t("form.login.password")}
        />
      </div>
      <Button type="submit" isLoading={isLoading}>
        {t("form.login.login")}
      </Button>
    </Form>
  );
};
