import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { Paths } from "./core/paths";
import styles from "./GlobalFooter.module.scss";

export const GlobalFooter: React.FC = () => {
  const { t } = useTranslation();

  const yearRange = useMemo(() => {
    const appStartYear = 2023;
    const currentYear = new Date().getFullYear();

    return currentYear > appStartYear
      ? `${appStartYear} - ${currentYear}`
      : currentYear;
  }, []);

  return (
    <div>
      <div className={styles.topFooter}>
        <div className={styles.footer}>
          <Link to={Paths.contact}>
            <FaEnvelope />
            <span>{t("footer.contact")}</span>
          </Link>
          <a href="https://TODO_GITHUB" target="_blank" rel="noreferrer">
            <FaGithub />
            <span>{t("footer.contribute")}</span>
          </a>
          <a href="https://zaliczgmine.pl" target="_blank" rel="noreferrer">
            <FaExternalLinkAlt />
            <span>{t("footer.originalApp")}</span>
          </a>
        </div>
      </div>
      <div className={styles.bottomFooter}>
        <div className={styles.footer}>
          {t("app.name")} © {yearRange}. Projekt i realizacja: Damiano Pantani
        </div>
      </div>
    </div>
  );
};
