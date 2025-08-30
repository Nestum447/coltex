import React, { useState } from "react";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";
import { FaFileUpload, FaFileExcel } from "react-icons/fa";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setText("");
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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #ff6a00, #ee0979)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        textShadow: "1px 1px 4px rgba(0,0,0,0.3)"
      }}>
        OCR React Excel
      </h1>

      <label style={{
        marginTop: "20px",
        padding: "12px 20px",
        borderRadius: "12px",
        background: "linear-gradient(90deg, #ff6a00, #ee0979)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <FaFileUpload size={20} />
        Subir Imagen
        <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      </label>

      {loading && (
        <div style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#fff",
          fontWeight: "bold"
        }}>
          <div className="spinner" style={{
            width: "50px",
            height: "50px",
            border: "6px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ marginTop: "10px" }}>Procesando imagen...</p>
        </div>
      )}

      {!loading && text && (
        <div style={{
          marginTop: "30px",
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <h2 style={{ fontSize: "1.5rem", color: "#fff", textAlign: "center" }}>
            Texto Detectado
          </h2>

          {text.split("\n").map((line, index) => (
            <div key={index} style={{
              backgroundColor: "#fff",
              padding: "10px 15px",
              borderRadius: "10px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              wordBreak: "break-word"
            }}>
              {line || <em>—</em>}
            </div>
          ))}

          <button
            onClick={downloadExcel}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #007BFF, #00C6FF)",
              color: "#fff",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseOver={e => e.target.style.opacity = 0.85}
            onMouseOut={e => e.target.style.opacity = 1}
          >
            <FaFileExcel size={18} />
            Descargar Excel
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
