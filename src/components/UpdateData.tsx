import React, { useState, ChangeEvent } from "react";

const UpdateData = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const extension = selectedFile.name.split(".").pop();
      if (extension && extension.toLowerCase() === "csv") {
        setFile(selectedFile);
        setError("");
        setSuccess("File uploaded successfully.");
      } else {
        setError("Please upload a CSV file.");
        setSuccess("");
      }
    }
  };

  const handleUpload = () => {
    if (file) {
      // Save the file with the name "birthdays.csv"
      const filename = "birthdays.csv";
      const formData = new FormData();
      console.log("File uploaded:", file);
      console.log("Attempting to save the file to: " + filename);
      formData.append("file", file, filename);

      setSuccess("File uploaded successfully.");
      setError("");
    } else {
      setError("Please select a file.");
      setSuccess("");
    }
  };

  return (
    <div className="user-update">
      <p>Upload CSV file:</p>
      <input
        className="form-control my-2"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <button
        className="btn btn-primary my-2"
        type="button"
        onClick={handleUpload}
      >
        Upload
      </button>
      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mt-2" role="alert">
          {success}
        </div>
      )}
    </div>
  );
};

export default UpdateData;
