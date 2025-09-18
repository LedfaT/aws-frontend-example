import { useState, useEffect } from "react";
import getConfig from "./config/environment.js";

function App() {
  const [count, setCount] = useState(0);
  const [backendMessage, setBackendMessage] = useState("Loading...");
  const [dbData, setDbData] = useState(null);
  const [cacheData, setCacheData] = useState(null);

  const config = getConfig();
  const apiUrl = config.api_url;
  console.log("Config:", import.meta.env.VITE_API_URL);
  console.log("API URL:", apiUrl);

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.text())
      .then((data) => setBackendMessage(data))
      .catch((err) => {
        console.error("Error fetching from backend:", err);
        setBackendMessage(err.message);
      });
  }, []);

  const fetchDbAndCache = async () => {
    try {
      const dbRes = await fetch(`${apiUrl}db`);
      const dbJson = await dbRes.json();
      setDbData(dbJson);

      const cacheRes = await fetch(`${apiUrl}cache`);
      const cacheJson = await cacheRes.json();
      setCacheData(cacheJson);
    } catch (err) {
      console.error("Error fetching DB/Cache:", err);
      setDbData({ error: err.message });
      setCacheData({ error: err.message });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>React + Express Demo</h1>

      <div style={styles.card}>
        <p>Backend says: {backendMessage}</p>
      </div>

      <div style={styles.card}>
        <button
          style={styles.button}
          onClick={() => {
            setCount((c) => c + 1);
            fetchDbAndCache();
          }}
        >
          Fetch DB & Cache (clicks: {count})
        </button>

        {dbData && (
          <div style={{ marginTop: "1rem", textAlign: "left" }}>
            <strong>PostgreSQL:</strong>
            <pre>{JSON.stringify(dbData, null, 2)}</pre>
          </div>
        )}

        {cacheData && (
          <div style={{ marginTop: "1rem", textAlign: "left" }}>
            <strong>Redis:</strong>
            <pre>{JSON.stringify(cacheData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    color: "#333",
  },
  card: {
    margin: "1rem auto",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "400px",
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default App;
