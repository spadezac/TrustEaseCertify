import { useState } from "react";

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function verifyCertificate() {
    fetch(`http://localhost:5000/api/verify-certificate/${certificateId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.verified) {
          setMessage(data.candidate_name);
          setError("");
        } else {
          if (data.error) {
            setError(data.error);
            setMessage("");
          } else {
            setError("Certificate not found");
            setMessage("");
          }
        }
      });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify Certificate</h1>
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          placeholder="Enter Certificate ID"
          className="m-2 p-2 border border-gray-300 rounded-md"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />
        <button
          className="m-2 p-2 bg-blue-500 text-white rounded"
          onClick={verifyCertificate}
        >
          Verify
        </button>
      </div>
      <div className="flex flex-row items-center justify-center">
        {message.length != 0 && (
          <div className="m-2 p-2 bg-green-200 rounded-md">
            <h1 className="text-lg font-bold text-center">Verified!</h1>
            <strong>Name: </strong>
            {message}
          </div>
        )}
        {error.length != 0 && (
          <div className="m-2 p-2 bg-red-200 rounded-md">
            <h1 className="text-lg font-bold text-center">Error</h1>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
