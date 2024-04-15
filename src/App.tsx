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

function App() {
  const isLoggedIn = true; // TODO: Make a simple login
  const [currentView, setCurrentView] = useState("Dashboard");
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [person, setPerson] = useState({
    name: "",
    date: "",
  });

  const getBirthdayList = async () => {
      console.log("Attempting to read file: birthdays.csv");
      try {
        // Read the contents of the CSV file
        fetch("birthdays.csv")
        .then((res) => res.text())
        .then((csvData) => {
          // Convert CSV data to an array of objects (assuming CSV structure)
          const lines = csvData.split('\n');
          console.log("lines");
          console.log(lines);
          const headers = lines[0].split(',');  // <-- Assuming first line is the headers
          
          const birthdays: Birthday[] = [];
          for (let i = 1; i < lines.length; i++) {
              var line = lines[i]
              if (! line) {continue}
              line = line.trim()
              if (! line) {continue}
              if ("#" === line[0]) {continue}  // <-- Skip comment lines
              const values = lines[i].split(',');
              const birthday: Birthday = {} as Birthday;
              for (let j = 0; j < headers.length; j++) {
                var valueToSet = values[j]
                if (! valueToSet) {
                  console.warn("Skipping null/empty value at index: " + j)
                  continue
                }
                birthday[headers[j].trim() as keyof Birthday] = valueToSet.trim();
              }
              birthdays.push(birthday);
          }

          console.log({ birthdays });
          // Set birthdays state or perform further processing
          setBirthdays(birthdays);
        })
        .catch((e) => console.error(e));
        
          
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    getBirthdayList();
  }, [isLoggedIn]);

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
            <BirthdayForm
            />
          </div>
          <div className="birthdayList">
            {birthdays.length > 0 && (
              <BirthdayList
                birthdays={birthdays}
              />
            )}
          </div>
        </>
      )}
      {currentView === "UpdateData" && (
        <>
          <UpdateData />
        </>
      )}
    </>
  );
}

export default App;
