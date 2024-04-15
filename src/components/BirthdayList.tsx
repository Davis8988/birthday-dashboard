import { useState } from "react";
import moment from "moment";

interface Birthday {
  id: string;
  personName: string;
  date: string;
}

interface Props {
  birthdays: Birthday[];
  // onDelete: (id: string) => void;
  // onSave: (id: string, newData: Partial<Birthday>) => void;
}

const BirthdayList = ({ birthdays }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDate, setEditedDate] = useState("");


  return (
    <div>
      <table className="table table-bordered table-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
          {birthdays.map((birthday) => (
            <tr key={birthday.id}>
              <td>
                {editingId === birthday.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  birthday.personName
                )}
              </td>
              <td>
                {editingId === birthday.id ? (
                  <>
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                    />
                  </>
                ) : (
                  moment(birthday.date).format("Do [of] MMMM")
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BirthdayList;
