import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import BirthdayList from "./components/BirthdayList";
import BirthdayForm from "./components/BirthdayForm";
import UpdateData from "./components/UpdateData";

interface Birthday {
  id: string;
  personName: string;
  date: string;
}

// Read interval duration from environment variable or default to 30000 milliseconds
const switchIntervalDuration = import.meta.env.BIRTHDAYS_PAGE_SWITCH_INTERVAL_DURATION || 30000;

function App() {
  const isLoggedIn = true; // TODO: Make a simple login
  const [currentView, setCurrentView] = useState("Dashboard");
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [person, setPerson] = useState({
    name: "",
    date: "",
  });

  const getBirthdayList = async () => {
	console.log("");
	console.log("-== Read birthdays routine ==-");
    console.log("Attempting to read file: birthdays.csv");
    try {
      // Read the contents of the CSV file
      fetch("birthdays.csv")
        .then((res) => res.text())
        .then((csvData) => {
          // Convert CSV data to an array of objects (assuming CSV structure)
          const lines = csvData.split("\n");
          console.log("Read lines:");
          console.log(lines);
          const headers = lines[0].split(","); // <-- Assuming first line is the headers
	      console.log("Headers: " + headers);
          const birthdays: Birthday[] = [];
		  console.log("Reading rest of the lines");
          for (let i = 1; i < lines.length; i++) {
            var line = lines[i];
            if (!line) {
              continue;
            }
            line = line.trim();
            if (!line) {
              continue;
            }
            if ("#" === line[0]) {
              continue;
            } // <-- Skip comment lines
            const values = lines[i].split(",");
            const birthday: Birthday = {} as Birthday;
            for (let j = 0; j < headers.length; j++) {
              var valueToSet = values[j];
              if (!valueToSet) {
                console.warn("Skipping null/empty value at index: " + j);
                continue;
              }
              birthday[
                headers[j].trim() as keyof Birthday
              ] = valueToSet.trim();
            }
            birthdays.push(birthday);
          }
		  
		  console.log("OK - Finished reading all lines");
		  console.log("Constructed birthdays objects array:");
          console.log({ birthdays });
          
		  // Set birthdays state or perform further processing
		  console.log("Saving results in memory");
          setBirthdays(birthdays);
        })
        .catch((e) => console.error(e));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBirthdayList();
	
	console.log("switchIntervalDuration=" + switchIntervalDuration);
    // Auto switch the view between "Dashboard" and "Birthdays" every SWITCH_INTERVAL_DURATION milliseconds
    const intervalId = setInterval(() => {
      switchView();
    }, switchIntervalDuration);

    // Clear the interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  // Function to switch the current view between "Dashboard" and "Birthdays"
  const switchView = () => {
    console.log("Switching view..");
    setCurrentView((prevView) =>
      prevView === "Dashboard" ? "Birthdays" : "Dashboard"
    );
  };

  return (
    <>
      <Navigation
        loggedIn={isLoggedIn}
        currentView={currentView}
        onSelectView={setCurrentView}
      />
      {currentView === "Dashboard" && (
        <Dashboard loggedIn={isLoggedIn} birthdays={birthdays} />
      )}
      {currentView === "Birthdays" && (
        <>
          <div className="birthday-form">
            <BirthdayForm />
          </div>
          <div className="birthdayList">
            {birthdays.length > 0 && <BirthdayList birthdays={birthdays} />}
          </div>
        </>
      )}
      {currentView === "UpdateData" && <UpdateData />}
    </>
  );
}

export default App;
