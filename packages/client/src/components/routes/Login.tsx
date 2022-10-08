import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import { LoginRequest } from "@damianopantani/zaliczgmine-server";
import { useSessionStore } from "../../SessionContext";
import { useFormikField } from "../forms/useFormikField";
import { Input } from "../forms/Input";
import { Button } from "../forms/Button";
import { Container } from "../Container";
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
      if (form.username && form.password) {
        setLoading(true);
        loginUser(form).catch(() => {
          // TODO: handle errors
          setLoading(false);
        });
      }
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
          <Button type="submit" isLoading={isLoading}>
            {t("form.login.login")}
          </Button>
          <div className={styles.disclaimer}>{t("form.login.disclaimer")}</div>
        </div>
      </Container>
    </Form>
  );
};
