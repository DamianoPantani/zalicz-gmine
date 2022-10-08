import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { Paths } from "../paths";
import styles from "./GlobalFooter.module.scss";

export const GlobalFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footer}>
        <Link to={Paths.contact}>
          <FaEnvelope />
          <span>{t("footer.contact")}</span>
        </Link>
        <a href="https://TODO_GITHUB" target="_blank" rel="noreferrer">
          <FaGithub />
          <span>{t("footer.contribute")}</span>
        </a>
        <a
          href="https://zaliczgmine.pl/users/login"
          target="_blank"
          rel="noreferrer"
        >
          <FaExternalLinkAlt />
          <span>{t("footer.originalApp")}</span>
        </a>
      </div>
    </div>
  );
};
