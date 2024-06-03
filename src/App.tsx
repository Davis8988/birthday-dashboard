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
const switchIntervalDuration       = import.meta.env.VITE_BIRTHDAYS_PAGE_SWITCH_VIEW_INTERVAL_MILLISECONDS   || 60000;  // Read switch view interval duration from environment variable or default to 60000 milliseconds (1 minute)
const reloadDataIntervalDuration   = import.meta.env.VITE_BIRTHDAYS_PAGE_RELOAD_DATA_INTERVAL_MILLISECONDS   || 75000;  // Re-read data duration from environment variable or default to 75000 milliseconds (1.25 minutes)
// const reloadDataIntervalDuration   = import.meta.env.VITE_BIRTHDAYS_PAGE_RELOAD_DATA_INTERVAL_MILLISECONDS   || 10000;  // Re-read data duration from environment variable or default to 75000 milliseconds (1.25 minutes)
const reloadWindowIntervalDuration = import.meta.env.VITE_BIRTHDAYS_PAGE_RELOAD_WINDOW_INTERVAL_MILLISECONDS || 75000;  // Reload window duration from environment variable or default to 75000 milliseconds (1.25 minutes)
const showUpdateBirthdaysListForMilliseconds = import.meta.env.VITE_BIRTHDAYS_PAGE_SHOW_UPDATE_BIRTHDAYS_LIST_FOR_MILLISECONDS || 15000;  // Show the update Birthdays toast notification for this amount of milliseconds or default to 15 seconds
const birthdaysDataFilePath        = import.meta.env.VITE_BIRTHDAYS_DATA_FILE_PATH                           || "./data/birthdays.csv";  // File name of the csv birthdays data file

// Global variable to contain the current last read birthdays from the file
let currentBirthdaysArr: Birthday[] = [];

function printBirthdaysArr(birthdays: Birthday[]): void {
  birthdays.forEach((birthday, index) => {
      console.log(` - ID: ${birthday.id}, Name: ${birthday.personName}, Birthday: ${birthday.date}`);
  });
}

function showChangesBanner(addedBirthdays: Birthday[], removedBirthdays: Birthday[]) {
  let bannerMessage = "";
  if (addedBirthdays.length > 0) {
    bannerMessage += `<br>Added (${addedBirthdays.length}):<br>`;
    addedBirthdays.forEach(birthday => {
      bannerMessage += `  &nbsp;&nbsp;&nbsp; Name: &nbsp;${birthday.personName} &nbsp;&nbsp;&nbsp;&nbsp;     Birthday: ${birthday.date}<br>`;
    });
  }
  if (removedBirthdays.length > 0) {
    bannerMessage += `<br>Removed (${removedBirthdays.length}):<br>`;
    removedBirthdays.forEach(birthday => {
      bannerMessage += `  &nbsp;&nbsp;&nbsp; Name: &nbsp;${birthday.personName} <br>`;
    });
  }
  if (bannerMessage.length === 0) {return}
  bannerMessage = `== Birthdays List Updated == <br>` + bannerMessage;
  bannerMessage += `<br>`;
  console.log(`Showing toast for ${showUpdateBirthdaysListForMilliseconds} millisec`);
  console.log(bannerMessage);
  showToast(bannerMessage);
}





function calculateDiff(newBirthdays: Birthday[], oldBirthdays: Birthday[]): { addedBirthdays: Birthday[], removedBirthdays: Birthday[] } {
  const addedBirthdays: Birthday[] = [];
  const removedBirthdays: Birthday[] = [];

  // Find added birthdays
  newBirthdays.forEach(newBirthday => {
    if (!oldBirthdays.some(oldBirthday => oldBirthday.personName === newBirthday.personName)) {
      addedBirthdays.push(newBirthday);
    }
  });

  // Find removed birthdays
  oldBirthdays.forEach(oldBirthday => {
    if (!newBirthdays.some(newBirthday => newBirthday.personName === oldBirthday.personName)) {
      removedBirthdays.push(oldBirthday);
    }
  });

  return { addedBirthdays, removedBirthdays };
}

function showToast(message: string) {
  const toastContainer = document.getElementById("toast-container");
  if (toastContainer) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = message;
    toastContainer.appendChild(toast);

    // Remove the toast after 7 seconds
    setTimeout(() => {
      toast.remove();
    }, showUpdateBirthdaysListForMilliseconds);

    // Set timeout to ensure toast is added to the DOM before showing
    setTimeout(() => {
      toast.classList.add("show");
    }, 100); // Adjust delay if necessary
  }
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
    console.log("");
    console.log("-== Read birthdays routine ==-");
    console.log("Attempting to read file: " + birthdaysDataFilePath);
    try {
      // Read the contents of the CSV file
      fetch(birthdaysDataFilePath)
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

          // Print lengths of new and old
          console.log(`New birthdays count:`, birthdays.length);
          console.log(`Old birthdays count:`, currentBirthdaysArr.length);
          console.log("");
          
          // Check if currentBirthdaysArr is initialized
          if (currentBirthdaysArr !== null && currentBirthdaysArr.length !== 0) {
            // Calculate differences
            const { addedBirthdays, removedBirthdays } = calculateDiff(birthdays, currentBirthdaysArr);
            console.log(`Added birthdays (${addedBirthdays.length}):`);
            printBirthdaysArr(addedBirthdays)
            console.log(`Removed birthdays (${removedBirthdays.length}):`);
            printBirthdaysArr(removedBirthdays)
            console.log("");
            showChangesBanner(addedBirthdays, removedBirthdays);
          }

          // Update global variable
          currentBirthdaysArr = birthdays;
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
	  console.log("Reloading data from file: " + birthdaysDataFilePath);
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
      <div id="toast-container"></div>
    </>
  );
}

export default App;
