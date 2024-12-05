import dayjs, { Dayjs } from "dayjs";
import "./App.css";
import Period from "./components/period/Period";
import { useState } from "react";

function App() {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(6, "day"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [fakeFetch, setFakeFetch] = useState<boolean>(false);
  const fetchdata = () => {
    setFakeFetch(true);
    setTimeout(() => {
      setFakeFetch(false);
    }, 4000);
  };
  return (
    <div className="container">
      <Period
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchData={fetchdata}
      />
      {fakeFetch && "Executando função..."}
    </div>
  );
}

export default App;
