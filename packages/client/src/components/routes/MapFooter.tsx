import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import { RequestResults } from "../../api/useAsync";
import { Button } from "../forms/Button";
import { InputBox } from "../forms/InputBox";
import { DatePicker } from "../forms/DatePicker";
import { Toast, useToast } from "../toast";

import { useMapStore } from "./MapContext";
import styles from "./MapFooter.module.scss";

export const MapFooter: React.FC = () => {
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const setVisitDate = useMapStore((s) => s.setVisitDate);
  const visitDate = useMapStore((s) => s.visitDate);
  const isSaving = useMapStore((s) => s.isSaving);
  const hasChanges = useMapStore((s) => s.hasChanges);
  const saveChanges = useMapStore((s) => s.saveChanges);
  const { openSuccess, openError, close } = toast;

  const formattedVisitDate = useMemo(
    () =>
      visitDate.toLocaleDateString(i18n.language, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [visitDate, i18n.language]
  );

  const setDateAndCloseToast = useCallback(
    (date: Date) => {
      setVisitDate(date);
      close();
    },
    [setVisitDate, close]
  );

  const saveChangesAndNotifyUser = useCallback(async () => {
    try {
      await saveChanges();
    } catch (e) {
      const { error } = e as RequestResults<void>;
      openError(t("form.map.saveError", { error }));
    }
  }, [saveChanges, openError, t]);

  return (
    <div className={styles.mapFooter}>
      <Toast toast={toast} />
      <InputBox
        onClick={() =>
          openSuccess(
            <DatePicker onChange={setDateAndCloseToast} value={visitDate} />
          )
        }
        className={cx(styles.dateInput, isSaving && styles.disabled)}
      >
        {formattedVisitDate}
      </InputBox>
      <Button
        disabled={!hasChanges}
        isLoading={isSaving}
        onClick={saveChangesAndNotifyUser}
      >
        {t("form.map.save")}
      </Button>
    </div>
  );
};
