import React, { useState } from "react";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });
      setText(result.data.text);
    } catch (error) {
      console.error("Error OCR:", error);
    }
    setLoading(false);
  };

  const downloadExcel = () => {
    const rows = text.split("\n").map((line) => [line]);
    const ws = XLSX.utils.aoa_to_sheet([["Texto Extraído"], ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OCR");
    XLSX.writeFile(wb, "resultado.xlsx");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">OCR App en React</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && <p className="mt-4">Procesando imagen...</p>}

      {!loading && text && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Texto Detectado:</h2>
          <table border="1" className="mx-auto mt-2">
            <thead>
              <tr>
                <th>Texto</th>
              </tr>
            </thead>
            <tbody>
              {text.split("\n").map((line, index) => (
                <tr key={index}>
                  <td>{line}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={downloadExcel}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Descargar Excel
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

