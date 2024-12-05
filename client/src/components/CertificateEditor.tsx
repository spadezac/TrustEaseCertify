import { useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import useImage from "use-image";
import { CSV } from "../definitions";

export default function CertificateEditor({
  template,
  csv,
}: {
  template: string;
  csv: CSV;
}) {
  const [position, setPosition] = useState({
    qr: { x: 0, y: 0 },
    name: { x: 0, y: 0 },
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nameDim, setNameDim] = useState({ width: 0, height: 0 });
  const [name, setName] = useState("");
  const [QRDim, setQRDim] = useState({ width: 0, height: 0 });
  const [QROffset, setQROffset] = useState(11);

  const [fontSize, setFontSize] = useState(100);
  const [showTest, setShowTest] = useState(false);
  const [testUrl, setTestUrl] = useState("");

  const img = new Image();
  img.src = `http://localhost:5000/api/template/${template}`;
  img.onload = () => {
    setDimensions({ width: img.width, height: img.height });
  };

  const [image] = useImage(`http://localhost:5000/api/template/${template}`);

  function testCert() {
    setShowTest(false);
    const payload = {
      name: name,
      font_size: fontSize,
      nx: (position.name.x + nameDim.width / 2) * (dimensions.width / 600),
      ny:
        (position.name.y + nameDim.height / 2) *
        (dimensions.height / (600 / (dimensions.width / dimensions.height))),

      qr_size: QRDim.width / QROffset,
      qx: position.qr.x * (dimensions.width / 600),
      qy:
        position.qr.y *
        (dimensions.height / (600 / (dimensions.width / dimensions.height))),

      template: template,
      csv: csv.name,
    };
    fetch("http://localhost:5000/api/test-certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) =>
      response.json().then((data) => {
        if (data.success == true) {
          setTestUrl(data.file);
          setShowTest(true);
        } else {
          setShowTest(false);
        }
      })
    );
  }
  function makeCert() {
    const payload = {
      name: name,
      font_size: fontSize,
      nx: (position.name.x + nameDim.width / 2) * (dimensions.width / 600),
      ny:
        (position.name.y + nameDim.height / 2) *
        (dimensions.height / (600 / (dimensions.width / dimensions.height))),

      qr_size: QRDim.width / QROffset,
      qx: position.qr.x * (dimensions.width / 600),
      qy:
        position.qr.y *
        (dimensions.height / (600 / (dimensions.width / dimensions.height))),

      template: template,
      csv: csv.name,
    };
    fetch("http://localhost:5000/api/generate-certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  function getNameDim() {
    const payload = {
      name: name,
      csv: csv.name,
      // name: "John Doe Sharma",
      font_size: fontSize,
    };
    fetch("http://localhost:5000/api/get-name-dim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => {
      response.json().then((data) => {
        setNameDim({
          width: (data.dim.w * 600) / dimensions.width,
          height:
            (data.dim.h * (600 / (dimensions.width / dimensions.height))) /
            dimensions.height,
        });
      });
    });
  }

  function getQRDim() {
    fetch("http://localhost:5000/api/get-qr-code-dim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
        setQRDim({
          width: (data.dim.w * 600) / dimensions.width,
          height:
            (data.dim.h * (600 / (dimensions.width / dimensions.height))) /
            dimensions.height,
        });
        setQROffset((data.dim.w * 600) / dimensions.width / 10);
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold my-4">Certificate Editor</h1>
      <div className="flex flex-row items-center justify-center">
        <Stage
          width={600}
          height={600 / (dimensions.width / dimensions.height)}
        >
          <Layer>
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={600}
              height={600 / (dimensions.width / dimensions.height)}
            />
            <Rect
              x={position.name.x}
              y={position.name.y}
              width={nameDim.width}
              height={nameDim.height}
              stroke={"red"}
              draggable
              onDragEnd={(e) => {
                setPosition({
                  ...position,
                  name: { x: e.target.x(), y: e.target.y() },
                });
              }}
            />
            <Rect
              x={position.qr.x}
              y={position.qr.y}
              width={QRDim.width}
              height={QRDim.height}
              stroke={"green"}
              draggable
              onDragEnd={(e) => {
                setPosition({
                  ...position,
                  qr: { x: e.target.x(), y: e.target.y() },
                });
              }}
            />
          </Layer>
        </Stage>
        <div className="flex flex-col items-center justify-center">
          <p className="m-2">Positions</p>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center">
              <p className="m-2">
                X: {position.name.x * (dimensions.width / 600)}
              </p>
              <p className="m-2">
                Y:{" "}
                {position.name.y *
                  (dimensions.height /
                    (600 / (dimensions.width / dimensions.height)))}
              </p>
            </div>
            <div className="flex flex-row items-center justify-center">
              <p className="m-2">
                QX: {position.qr.x * (dimensions.width / 600)}
              </p>
              <p className="m-2">
                QY:{" "}
                {position.qr.y *
                  (dimensions.height /
                    (600 / (dimensions.width / dimensions.height)))}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center">
            <button
              className="m-2 p-2 bg-blue-500 text-white rounded"
              onClick={testCert}
            >
              Test
            </button>
            <button
              className="m-2 p-2 bg-blue-500 text-white rounded"
              onClick={makeCert}
            >
              Generate
            </button>
          </div>
          {csv && (
            <>
              <select
                className="m-2 p-2 w-80"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              >
                <option value="">Select Name</option>
                {csv.fields.map((row, id) => (
                  <option key={id} value={row}>
                    {row}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="m-2 p-2"
                placeholder="Font Size"
                value={fontSize}
                name="fontSize"
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
              <button
                className="m-2 p-2 bg-blue-500 text-white rounded"
                onClick={getNameDim}
              >
                Get Box{" "}
              </button>
              <input
                type="number"
                className="m-2 p-2"
                placeholder="QR Code Size"
                value={QRDim.width}
                name="name"
                onChange={(e) =>
                  setQRDim({
                    width: parseFloat(e.target.value),
                    height: parseFloat(e.target.value),
                  })
                }
              />
              <button
                className="m-2 p-2 bg-blue-500 text-white rounded"
                onClick={getQRDim}
              >
                Get Box{" "}
              </button>
            </>
          )}
        </div>
      </div>
      {showTest && (
        <img
          className="m-4"
          src={testUrl}
          alt="Generated Certificate"
          width={600}
        />
      )}
    </div>
  );
}
