import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
  StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MouseEvent, useCallback, useRef, useState } from "react";
import "./Period.css";
import { Dayjs } from "dayjs";
interface Props {
  startDate: Dayjs;
  endDate: Dayjs;
  setStartDate: (date: Dayjs) => void;
  setEndDate: (date: Dayjs) => void;
  time?: boolean;
  optionsTime?: { name: string; value: number }[];
  fetchData: () => void;
}
interface BackgroundRangePickerProps extends PickersDayProps<Dayjs> {
  inicial: Dayjs | null;
  final: Dayjs | null;
}

function Period(props: Props) {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    time,
    optionsTime,
    fetchData,
  } = props;
  const theme = useTheme();

  const colorSecondary = theme.palette.primary.main + "1A";
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [inicial, setInicial] = useState<Dayjs | null>(startDate || null);
  const [final, setFinal] = useState<Dayjs | null>(endDate || null);
  const isToday =
    dayjs(final).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  const isStartDateAfterEndDate =
    dayjs(inicial).format("YYYY-MM-DD") > dayjs(final).format("YYYY-MM-DD");
  const disableBtnFetch = () => {
    if (
      dayjs(inicial).format("YYYY-MM-DD") > dayjs(final).format("YYYY-MM-DD")
    ) {
      return true;
    } else if (
      !inicial?.isValid() ||
      !startDate?.isValid() ||
      !final?.isValid() ||
      !endDate?.isValid()
    ) {
      return true;
    } else {
      return false;
    }
  };
  const [clickInputDate, setClickInputDate] = useState<boolean>(false);
  const datePickerToRef = useRef<HTMLDivElement>(null);
  const datePickerFromRef = useRef<HTMLDivElement>(null);
  const [periodSelected, setPeriodSelected] = useState<number | null>(6);

  const labelInputPeriod = () => {
    if (startDate.isValid() && !endDate.isValid()) {
      return startDate?.format("DD/MM/YYYY") + " - " + "error";
    } else if (!startDate.isValid() && endDate.isValid()) {
      return "error" + " - " + endDate?.format("DD/MM/YYYY");
    } else if (startDate.isValid() && endDate.isValid()) {
      return (
        startDate?.format("DD/MM/YYYY") + " - " + endDate?.format("DD/MM/YYYY")
      );
    } else {
      return "error";
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangedate = (start: boolean, date: string) => {
    const day = dayjs(date, "DD/MM/YYYY");
    if (day.isValid()) {
      const format = day?.format("YYYY-MM-DD");
      const newDate = dayjs(format);
      if (!inicial || clickInputDate) return;
      if (start) {
        setStartDate(newDate);
        setInicial(newDate);
      } else {
        setEndDate(newDate);
        setFinal(newDate);
      }
    }
  };

  const handleChangeRangeDate = useCallback(
    (newDate: Dayjs | null) => {
      if (!newDate) return;
      setClickInputDate(true);

      if (
        inicial !== dayjs().subtract(7, "day") ||
        inicial !== dayjs().subtract(15, "day") ||
        inicial !== dayjs().subtract(30, "day")
      ) {
        setPeriodSelected(null);
      }
      if (isSelectingStart || !inicial || newDate.isBefore(inicial)) {
        setInicial(newDate);
        setStartDate(newDate);
        setFinal(null);
        setIsSelectingStart(false);
        if (datePickerToRef && datePickerToRef.current) {
          datePickerToRef.current.focus();
        }
      } else if (newDate.isAfter(inicial)) {
        handleChangeChipDays(newDate);
        setFinal(newDate);
        setEndDate(newDate);
        setIsSelectingStart(true);
      } else if (newDate.isSame(inicial)) {
        handleChangeChipDays(newDate);
        setFinal(newDate);
        setEndDate(newDate);
        setIsSelectingStart(true);
      }
    },
    [inicial, isSelectingStart]
  );

  const BackgoundRangePicker: React.FC<BackgroundRangePickerProps> = (
    props
  ) => {
    const { inicial, final, day } = props;
    const formatFrom = dayjs(inicial).format("YYYY-MM-DD");
    const formatTo = dayjs(final).format("YYYY-MM-DD");

    const isInRange = (day: Dayjs, start: Dayjs | null, end: Dayjs | null) => {
      if (!start || !end) {
        return false;
      }
      return day.isAfter(start) && day.isBefore(end);
    };
    // Verifica se o dia está dentro do intervalo
    const isWithinRange = isInRange(day, inicial, final);
    const isSab = day.day() === 6;
    const isDom = day.day() === 0;
    // Verifica se o dia é igual à data inicial ou final
    const isStartOrEnd = day.isSame(inicial, "day") || day.isSame(final, "day");
    const isInicial = day.isSame(inicial, "day");
    const isToday = dayjs().format("YYYY-MM-DD") == day.format("YYYY-MM-DD");
    let background = "transparent";
    let boxBg = "transparent";
    let borderRadius = "0px";
    let boxBr = borderRadius;
    if (isToday) {
      borderRadius = "50%";
    }
    if (!isStartDateAfterEndDate) {
      if (isStartOrEnd) {
        background = theme.palette.primary.main;
        if (final) {
          boxBg = colorSecondary;
        }
      } else if (isWithinRange) {
        background = colorSecondary;
        if (isToday) {
          background = "transparent";
          boxBg = colorSecondary;
        }
      }
    } else {
      background = "transparent";
      boxBg = "transparent";
    }
    if (formatFrom !== formatTo) {
      if (isWithinRange && isSab) {
        borderRadius = "0 50% 50% 0";
      }
      if (isWithinRange && isDom) {
        borderRadius = "50% 0 0 50%";
      }
      if (isStartOrEnd) {
        borderRadius = "50%";
        if (isInicial) {
          if (isSab) {
            boxBr = "50%";
          } else {
            boxBr = "50% 0 0 50%";
          }
        } else {
          if (isDom) {
            boxBr = "50%";
          } else {
            boxBr = "0 50% 50% 0";
          }
        }
      }
    } else if (inicial && final && formatFrom === formatTo) {
      borderRadius = "50%";
      boxBr = "50%";
    }
    const color =
      isStartDateAfterEndDate && isStartOrEnd
        ? "red"
        : isStartOrEnd
        ? "#ffff"
        : "default";

    return (
      <PickersDay
        {...props}
        day={day}
        sx={{
          margin: 0,
          width: "37px",
          backgroundColor: background,
          color: color,
          borderRadius: borderRadius,
          position: "relative",

          "&:hover": {
            backgroundColor: background,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            borderRadius: boxBr,
            backgroundColor: boxBg,
            zIndex: 0,
          },
          "&.Mui-selected": {
            background: background,
            color: isStartOrEnd ? "white" : "#565757",
            "&:hover": {
              backgroundColor: background,
            },
          },
        }}
      />
    );
  };

  const cancelFilters = () => {
    const initialDate = dayjs().subtract(6, "day");
    const finalDate = dayjs();
    setInicial(initialDate);
    setStartDate(initialDate);
    setFinal(finalDate);
    setEndDate(finalDate);
    setAnchorEl(null);
    changePeriodSelected(6);
  };

  const umDia = "1 dia";
  const currentDate =
    endDate.diff(startDate, "day") === 0
      ? "1 dia"
      : endDate.diff(startDate, "day") + 1 + " dias";
  const [moreThanADay, setMoreThanADay] = useState<string>(currentDate);

  const changePeriodSelected = (period: number) => {
    setPeriodSelected(period);
    const today = dayjs();
    const range = dayjs()?.subtract(period, "day");
    if (period === 0) {
      setInicial(today);
      setStartDate(today);
    } else {
      setInicial(range);
      setStartDate(range);
    }

    const days = period + 1;
    const legend = days === 1 ? " dia" : " dias";
    setMoreThanADay(days + legend);
    setFinal(today);
    setEndDate(today);
    handleClose();
  };

  const startFecthdata = () => {
    fetchData();
    handleClose();
  };

  const handleChangeChipDays = (date: Dayjs) => {
    if (!inicial?.isValid() || date.diff(startDate, "day") < 0)
      setMoreThanADay("Data inválida");
    else if (date.diff(startDate, "day") === 0) setMoreThanADay(umDia);
    else {
      const days = date ? date.diff(inicial, "day") + 1 + " dias" : "";
      setMoreThanADay(days);
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <TextField
        label="Período"
        variant="outlined"
        value={labelInputPeriod()}
        sx={{ minWidth: "300px" }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                <CalendarMonthRoundedIcon color="action" />
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                <Typography
                  bgcolor={colorSecondary}
                  px={1}
                  borderRadius={"5px"}
                  variant="body2"
                  color={theme.palette.primary.main}
                >
                  {moreThanADay}
                </Typography>
              </InputAdornment>
            ),
            size: "small",
            onClick: handleClick,
          },
        }}
      />
      {open ? (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box
            width={"550px"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
            borderRadius={"5px"}
          >
            <Box
              width={"100%"}
              display={"flex"}
              gap={2}
              p={"1.5rem 1.5rem 0 1.5rem"}
              boxSizing={"border-box"}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <button
                  className={`btn-period-component ${
                    isToday && periodSelected === 0 ? "active" : ""
                  }`}
                  onClick={() => changePeriodSelected(0)}
                  key="1"
                >
                  Hoje
                </button>
                <button
                  className={`btn-period-component ${
                    isToday && periodSelected === 6 ? "active" : ""
                  }`}
                  onClick={() => changePeriodSelected(6)}
                  key="2"
                >
                  Últimos 7 dias
                </button>
                <button
                  className={`btn-period-component ${
                    isToday && periodSelected === 14 ? "active" : ""
                  }`}
                  onClick={() => changePeriodSelected(14)}
                  key="3"
                >
                  Últimos 15 dias
                </button>
                <button
                  className={`btn-period-component ${
                    isToday && periodSelected === 29 ? "active" : ""
                  }`}
                  onClick={() => changePeriodSelected(29)}
                  key="4"
                >
                  Últimos 30 dias
                </button>
              </div>

              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"flex-end"}
                  gap={2}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box width={"100%"} display={"flex"} gap={2}>
                      <DatePicker
                        label={"Data inicial"}
                        disableOpenPicker
                        value={startDate || dayjs()}
                        format="DD/MM/YYYY"
                        sx={{
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            inputRef: datePickerFromRef,
                            onBlur: (
                              date: React.FocusEvent<HTMLInputElement>
                            ) => {
                              const inputValue = date?.target?.value;
                              handleChangedate(true, inputValue);
                            },
                            onClick: () => setClickInputDate(false),
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  border: isStartDateAfterEndDate
                                    ? "1px solid red"
                                    : "",
                                },
                              },
                              "& .MuiOutlinedInput-root:hover": {
                                "& fieldset": {
                                  border: isStartDateAfterEndDate
                                    ? "1px solid red"
                                    : "",
                                },
                              },
                            },
                          },
                        }}
                      />
                      <DatePicker
                        label={"Data final"}
                        disableOpenPicker
                        value={endDate || dayjs()}
                        format="DD/MM/YYYY"
                        sx={{
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            inputRef: datePickerToRef,
                            onBlur: (
                              date: React.FocusEvent<HTMLInputElement>
                            ) => handleChangedate(false, date?.target?.value),
                            onClick: () => setClickInputDate(false),
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  border: isStartDateAfterEndDate
                                    ? "1px solid red"
                                    : "",
                                },
                              },
                              "& .MuiOutlinedInput-root:hover": {
                                "& fieldset": {
                                  border: isStartDateAfterEndDate
                                    ? "1px solid red"
                                    : "",
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </LocalizationProvider>
                  {time && optionsTime && (
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Hora
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Hora"
                      >
                        {optionsTime.map((time) => (
                          <MenuItem value={time.value}>{time.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={"pt-br"}
                >
                  <StaticDatePicker
                    disableHighlightToday
                    onChange={handleChangeRangeDate}
                    disableFuture
                    slots={{
                      toolbar: () => null,
                      day: (dayProps: PickersDayProps<Dayjs>) => (
                        <BackgoundRangePicker
                          {...dayProps}
                          inicial={inicial}
                          final={final}
                          onClick={() => handleChangeRangeDate(dayProps.day)}
                        />
                      ),
                    }}
                    slotProps={{
                      actionBar: {
                        actions: [],
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            {isStartDateAfterEndDate && (
              <Alert
                severity="error"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                A data inicial não pode ser maior que a data final
              </Alert>
            )}
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"flex-end"}
              borderTop={"1px solid #e6e6e6"}
              gap={1}
              py={1}
              px={2}
            >
              <Button onClick={cancelFilters}>Sair</Button>
              <Button disabled={disableBtnFetch()} onClick={startFecthdata}>
                Buscar
              </Button>
            </Box>
          </Box>
        </Popover>
      ) : null}
    </Box>
  );
}

export default Period;
