import moment from "moment";

interface Birthday {
  id: string;
  personName: string;
  date: string;
}

interface Props {
  birthdays: Birthday[];
  today: string; // Assuming 'today' is a string in the format 'YYYY-MM-DD'
}

export const BirthdayMessageMonth = ({ birthdays, today }: Props) => {
  // Filter birthdays to find those that match 'today' and then map to JSX elements
  const thisMonthBirthdays = birthdays.filter((person) => {
    return (
      moment(person.date).format("M MM") === moment(today).format("M MM") &&
      moment(moment(person.date).format("MM-DD")).isAfter(
        moment(today).format("MM-DD")
      )
    );
  });

  const birthdayMessages = thisMonthBirthdays.map((person) => (
    <>
      <ul key={person.id} className="list-group">
        <li key={person.id} className="list-group-item">
          <h3 className="display-5 text-center">
          <strong>{person.personName}</strong>'s birthday is on the {moment(person.date).format("Do")}
          </h3>
        </li>
      </ul>
    </>
  ));

  // Return a fragment containing all matching birthday messages
  return (
    <>
      {thisMonthBirthdays.length !== 0 && (
        <>
          <h2 className="text-center mt-3">This month:</h2> {birthdayMessages}
        </>
      )}
    </>
  );
};

export default BirthdayMessageMonth;
