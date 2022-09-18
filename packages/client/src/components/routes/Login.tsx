import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import { LoginRequest } from "@damianopantani/zaliczgmine-server";
import { useFormikField } from "../forms/useFormikField";
import { Input } from "../forms/Input";
import { Button } from "../forms/Button";
import { LoadingSpinner } from "../LoadingSpinner";
import { useSessionStore } from "../../SessionContext";

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
      loginUser(form).catch((e) => {
        // TODO: handle errors
        console.log(e);
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
    <Form>
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
      <Button type="submit" disabled={isLoading}>
        {isLoading && <LoadingSpinner size="xs" />}
        {t("form.login.login")}
      </Button>
    </Form>
  );
};
