import { useState } from "react";
import CertificateEditor from "./components/CertificateEditor";
import TemplateList from "./components/TemplateList";
import TemplateUploader from "./components/TemplateUploader";
import CSVUploader from "./components/CSVUploader";
import CSVList from "./components/CSVList";
import { CSV } from "./definitions";
import VerifyCertificate from "./components/VerifyCertificate";
// import TemplateEditor from "./components/TemplateEditor";

function App() {
  const [template, setTemplate] = useState("");
  const [csv, setCsv] = useState<CSV>({
    name: "",
    fields: [],
  });
  return (
    <>
      {/* <TemplateEditor template={template}/> */}
      <CertificateEditor template={template} csv={csv} />
      <TemplateUploader />
      <CSVUploader />
      <TemplateList setTemplate={setTemplate} />
      <CSVList setCsv={setCsv} />
      <VerifyCertificate />
    </>
  );
}

export default App;
