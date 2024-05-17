import axios from "axios";
import React, { useState, useEffect } from "react";
const SERVER_URL = process.env.VITE_SERVER_URL;
const CA_ENDPOINT = process.env.VITE_CA_ENDPOINT;
const US_ENDPOINT = process.env.VITE_US_ENDPOINT;

interface ExportToSheetProps {
  endpoint: string;
  jsonData: any[];
}

type SheetData = string[][];

const ExportToSheet: React.FC<ExportToSheetProps> = ({
  endpoint,
  jsonData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [caData, setCaData] = useState<SheetData | null>(null);
  const [usData, setUsData] = useState<SheetData | null>(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/${CA_ENDPOINT}`)
      .then((res) => {
        setCaData(res.data);
        return axios.get(`${SERVER_URL}/${US_ENDPOINT}`);
      })
      .then((res) => {
        setUsData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const findMatches = (sheetData: SheetData | null, jsonData: any[]) => {
    if (!sheetData) return [];

    const matches = jsonData
      .map((item) => {
        const rowIndex = sheetData.findIndex((row) => row[11] === item.sku);
        if (rowIndex !== -1) {
          return {
            ...item,
            rowIndex: rowIndex + 2, // Add 2 to account for 0-indexing and header row
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    return matches;
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let matches;

      // check CAD or not
      if (endpoint.includes(`${CA_ENDPOINT}}`)) {
        matches = findMatches(caData, jsonData);
      } else {
        matches = findMatches(usData, jsonData);
      }

      if (matches.length > 0) {
        console.log("MATCH DATA", { data: matches });
        await axios.post(endpoint, { data: matches });
        setSuccess("Data exported successfully.");
      } else {
        setError("No matching data found to export.");
      }
    } catch (err: any) {
      setError("Failed to export data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleExport} disabled={loading}>
        {loading ? "Exporting..." : "Export to Google Sheet"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default ExportToSheet;
