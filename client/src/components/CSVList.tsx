import { useEffect, useState } from "react";
import { CSV } from "../definitions";

export default function CSVList({ setCsv }: { setCsv: (state: CSV) => void }) {
  const [csvs, setCsvs] = useState<CSV[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/get-csv")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCsvs(data.csvs);
      });
  }, []);
  console.log(csvs);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold my-4">CSV List</h1>
      <div className="flex flex-row items-center justify-center">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {csvs.map((csv, id) => (
              <tr key={id}>
                <td className="border px-4 py-2">{csv.name}</td>
                <td className="border px-4 py-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                      setCsv(csv);
                    }}
                  >
                    Make Certificate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
