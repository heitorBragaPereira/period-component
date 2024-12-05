import dayjs from "dayjs";
import Period from "./Period";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Test in component of Period.tsx", () => {
  const startDate = dayjs().subtract(7, "day");
  const endDate = dayjs();
  const setStartDate = jest.fn();
  const setEndDate = jest.fn();
  const handleClick = jest.fn();

  const openRangeDate = () => {
    const calendarIcon = screen.getByTestId("CalendarMonthRoundedIcon");
    return userEvent.click(calendarIcon);
  };

  const component = (
    <Period
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      fetchData={handleClick}
    />
  );
  it("Should render the input field with a calendar icon inside", () => {
    render(
      <Period
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchData={handleClick}
      />
    );
    expect(screen.getByLabelText("Período")).toBeInTheDocument();
    expect(screen.getByTestId("CalendarMonthRoundedIcon")).toBeInTheDocument();
  });

  it("Should show the number of days between the selected dates", async () => {
    const startDate = dayjs();
    const endDate = dayjs();
    render(
      <Period
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchData={handleClick}
      />
    );
    openRangeDate();
    await waitFor(() => {
      expect(screen.getByText("1 dia")).toBeInTheDocument();
    });
  });

  it("Should open and close the calendar popover when clicking the icon", async () => {
    const { findByText, queryByText } = render(component);
    openRangeDate();
    expect(await findByText("Hoje")).toBeInTheDocument();
    const backdrop = document?.querySelector(".MuiBackdrop-root");
    if (backdrop) userEvent.click(backdrop);
    await waitFor(() => {
      expect(queryByText("Hoje")).not.toBeInTheDocument();
    });
  });

  it("You must search for the 7-day period by clicking on the last 7 days button", async () => {
    render(component);
    openRangeDate();
    const btnSevenDays = await screen.findByRole("button", {
      name: "Últimos 7 dias",
    });
    userEvent.click(btnSevenDays);
    await waitFor(() => {
      expect(btnSevenDays).toHaveClass("active");
    });
  });

  it("Should show an error message if the start date is greater than the end date", async () => {
    const { findByLabelText, findByText } = render(component);
    openRangeDate();
    const finalDate = await findByLabelText("Data final");
    const mockDate = dayjs().subtract(15, "day").format("DD/MM/YYYY");
    await userEvent.type(finalDate, mockDate);
    await userEvent.tab();
    expect(finalDate).toHaveValue(mockDate);
    const alert = await findByText(
      "A data inicial não pode ser maior que a data final"
    );
    expect(alert).toBeInTheDocument();
  });

  it("When clicking on search the popover must be hidden", async () => {
    const { findByRole } = render(component);
    openRangeDate();
    const btnFetch = await findByRole("button", { name: "Buscar" });
    expect(btnFetch).toBeInTheDocument();
    userEvent.click(btnFetch);
    await waitFor(() => {
      expect(btnFetch).not.toBeInTheDocument();
    });
  });

  it("deve atualizar o input com a data selecionada no calendário", async () => {
    render(component);
    openRangeDate();
    const dateButton = await screen.findByRole("button", {
      name: "Últimos 30 dias",
    });
    userEvent.click(dateButton);
    expect(await screen.findByText("30 dias")).toBeInTheDocument();
  });
});
