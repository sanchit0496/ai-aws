import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/appusers/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res)
      setResult(res.data.results);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload an Image to Get Translations & Audio</h2>
      <h4>An AI-powered MERN app that lets users upload an image and receive translated text with audio in five different languages using AWS Textract, Translate, and Polly </h4>

      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />

      <button onClick={handleUpload}>Upload and Process</button>
      {loading && <p>Processing your image...</p>}

      {result.length > 0 && (
  <div style={{ marginTop: "2rem" }}>
    <h3>Translations & Audio:</h3>
    {result.map((item, index) => (
      <div key={index}>
        <p><strong>{item.language}</strong>: {item.text}</p>
        <audio controls src={`http://localhost:8080${item.url}`} />
        <hr />
      </div>
    ))}
  </div>
)}

    </div>
  );
}

export default FileUpload;
