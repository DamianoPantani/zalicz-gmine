import React, { useEffect } from "react";
import { loginUser } from "./api";

export const Login: React.FC = () => {
  useEffect(() => {
    loginUser({ username: "damianopantani", password: "UpTrance09" })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  }, []);

  return <div>TEST - LOGIN</div>;
};
