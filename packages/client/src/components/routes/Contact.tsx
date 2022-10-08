import React, { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { FaAt, FaBicycle, FaStackOverflow, FaRegCompass } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { Container } from "../Container";
import styles from "./Contact.module.scss";

type ContactRowProps = PropsWithChildren<{
  Icon: IconType;
  title: string;
  link?: string;
}>;

export const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("footer.contact")}</h1>
      <Container>
        <div className={styles.contact}>
          <ContactRow Icon={FaAt} title={t("contact.email")}>
            dejmiens( a )yahoo.com
          </ContactRow>
          <ContactRow
            Icon={FaStackOverflow}
            title={t("contact.stackoverflow")}
            link="https://stackoverflow.com/users/4060922/damiano/"
          >
            damiano
          </ContactRow>
          <ContactRow
            Icon={FaBicycle}
            title={t("contact.bikestats")}
            link="http://damianopantani.bikestats.pl/c,29878,Ze-zdjeciami.html"
          >
            damianopantani
          </ContactRow>
          <ContactRow
            Icon={FaRegCompass}
            title={t("contact.zaliczgmine")}
            link="https://zaliczgmine.pl/users/view/5113"
          >
            <img
              src="https://zaliczgmine.pl/img/buttons/button-5113-black.png"
              alt="button"
            />
          </ContactRow>
        </div>
      </Container>
    </div>
  );
};

const ContactRow: React.FC<ContactRowProps> = ({
  children,
  title,
  Icon,
  link,
}) => {
  return (
    <>
      <Icon />
      <h5>{title}</h5>
      <h4>
        {link ? (
          <a target="_blank" rel="noreferrer" href={link}>
            {children}
          </a>
        ) : (
          children
        )}
      </h4>
    </>
  );
};
