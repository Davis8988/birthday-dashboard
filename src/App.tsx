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

// Global Vars
const switchIntervalDuration        = import.meta.env.VITE_BIRTHDAYS_PAGE_SWITCH_VIEW_INTERVAL_MILLISECONDS   || 60000;                          // Read switch view interval duration from environment variable or default to 60000 milliseconds (1 minute)
const reloadDataIntervalDuration    = import.meta.env.VITE_BIRTHDAYS_PAGE_RELOAD_DATA_INTERVAL_MILLISECONDS   || 75000;                          // Re-read data duration from environment variable or default to 75000 milliseconds (1.25 minutes)
const reloadWindowIntervalDuration  = import.meta.env.VITE_BIRTHDAYS_PAGE_RELOAD_WINDOW_INTERVAL_MILLISECONDS || 75000;                          // Reload window duration from environment variable or default to 75000 milliseconds (1.25 minutes)
const birthdaysDataFileRelativePath = import.meta.env.VITE_BIRTHDAYS_DATA_FILE_RELATIVE_PATH                  || "data/birthdays.csv";  // File name of the csv birthdays data file


function App() {
  const isLoggedIn = true; // TODO: Make a simple login
  const [currentView, setCurrentView] = useState("Dashboard");
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  const getBirthdayList = async () => {
    console.log("");
    console.log("-== Read birthdays routine ==-");
    console.log("Attempting to read file: " + birthdaysDataFileRelativePath);
    try {
      // Read the contents of the CSV file
      fetch(birthdaysDataFileRelativePath)
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
    getBirthdayList(); // initial read of data

	// Prints
    console.log("switchIntervalDuration=" + switchIntervalDuration);
    console.log("reloadDataIntervalDuration=" + reloadDataIntervalDuration);
    console.log("reloadWindowIntervalDuration=" + reloadWindowIntervalDuration);
	
    // Auto switch the view between "Dashboard" and "Birthdays" every $switchIntervalDuration milliseconds
    const switchIntervalId = setInterval(() => {
      switchView();
    }, switchIntervalDuration);

    // Reload the data every reloadDataIntervalDuration milliseconds
    const reloadDataIntervalId = setInterval(() => {
	  console.log("Reloading data from file: " + birthdaysDataFileRelativePath);
      getBirthdayList();
    }, reloadDataIntervalDuration);
	
    // Reload the page every reloadWindowIntervalDuration milliseconds
    const reloadWindowIntervalId = setInterval(() => {
	  console.log("Reloading window ..");
      window.location.reload();
    }, reloadWindowIntervalDuration);

    // Clear the intervals on component unmount to prevent memory leaks
    return () => {
      clearInterval(switchIntervalId);
      clearInterval(reloadDataIntervalId);
      clearInterval(reloadWindowIntervalId);
    };
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
