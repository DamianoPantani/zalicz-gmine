import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import { LoginRequest } from "@damianopantani/zaliczgmine-server";
import { useSessionStore } from "../core/SessionContext";
import { useFormikField } from "../forms/useFormikField";
import { Input } from "../forms/Input";
import { Button } from "../forms/Button";
import { Container } from "../Container";
import styles from "./Login.module.scss";

type Props = {
  isLoading: boolean;
  error?: string;
};

const initialLoginValues: LoginRequest = { password: "", username: "" };

export const Login: React.FC = () => {
  const loginUser = useSessionStore((s) => s.login);
  const loginError = useSessionStore((s) => s.loginError);
  const isLoggingIn = useSessionStore((s) => s.isLoggingIn);

  return (
    <Formik initialValues={initialLoginValues} onSubmit={loginUser}>
      <LoginForm isLoading={isLoggingIn} error={loginError} />
    </Formik>
  );
};

const LoginForm = ({ isLoading, error }: Props) => {
  const { t } = useTranslation();
  const [username, setUsername] = useFormikField<string>("username");
  const [password, setPassword] = useFormikField<string>("password");

  return (
    <Form>
      <h1>{t("nav.login")}</h1>
      <Container>
        <div className={styles.form}>
          <div>
            <h5>{t("form.login.username")}</h5>
            <Input
              value={username}
              onChange={setUsername}
              placeholder={t("form.login.username")}
            />
          </div>
          <div>
            <h5>{t("form.login.password")}</h5>
            <Input
              value={password}
              onChange={setPassword}
              type="password"
              placeholder={t("form.login.password")}
            />
          </div>
          <div className={styles.formState}>
            <Button type="submit" isLoading={isLoading}>
              {t("form.login.login")}
            </Button>
            {error && <span className={styles.error}>{error}</span>}
          </div>
          <div className={styles.disclaimer}>{t("form.login.disclaimer")}</div>
        </div>
      </Container>
    </Form>
  );
};
