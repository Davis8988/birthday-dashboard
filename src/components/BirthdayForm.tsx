import React, { FormEvent } from "react";

interface Person {
  date: string;
  name: string;
}


const BirthdayForm = () => {
  return (
    <>
      <h1 className="text-center m-3">🎂 Birthday Tracker 🎂</h1>
      <div className="p-3">
        <strong>All Birthdays</strong>
      </div>
    </>
  );
};

export default BirthdayForm;
