import React, { ReactElement, useCallback, useMemo } from "react";
import { CalendarWithShortcuts } from "@natscale/react-calendar";
import { useTranslation } from "react-i18next";
import {
  ShortcutButtonModel,
  Value,
  WeekdayIndices,
} from "@natscale/react-calendar/dist/utils/types";
import "@natscale/react-calendar/dist/main.css";

import "./ReactCalendar.scss"; // not a css module, overrides global class names

type Props = {
  onChange: (val: Date) => void;
  value: Date;
};

export const DatePicker = ({ onChange, value }: Props): ReactElement => {
  const { t } = useTranslation();
  const onRangeChange = useCallback(
    (value: Value) => onChange(value as Date),
    [onChange]
  );

  // no shortucts - no other workaround
  const noShortcutButtons = useMemo(
    (): ShortcutButtonModel[] => [{ id: "-", render: () => <></> }],
    []
  );

  const weekDaysLabel = useMemo(
    (): Record<WeekdayIndices, string> =>
      t("weekday.short", { returnObjects: true }),
    [t]
  );

  return (
    <CalendarWithShortcuts
      noPadRangeCell
      value={value}
      onChange={onRangeChange}
      shortcutButtons={noShortcutButtons}
      weekDaysLabel={weekDaysLabel}
    />
  );
};
