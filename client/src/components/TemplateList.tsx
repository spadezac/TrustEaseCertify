import { useEffect, useState } from "react";

export default function TemplateList({setTemplate}: {setTemplate: (state:string)=>void}) {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/get-templates")
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data.templates);
      });
  }, []);
  console.log(templates);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold my-4">Template List</h1>
      <div className="flex flex-row items-center justify-center">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, id) => (
              <tr key={id}>
                <td className="border px-4 py-2">{template}</td>
                <td className="border px-4 py-2">
                  <button className="p-2 bg-blue-500 text-white rounded" onClick={()=>{setTemplate(template)}}>
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
