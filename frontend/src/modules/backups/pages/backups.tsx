import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const apiBase = "http://127.0.0.1:8000/api/v1/services";

const BackupsIndex = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tableList, setTableList] = useState<string[]>([]);

  // Obtener lista de tablas al montar el componente
  useEffect(() => {
    axios
      .get(`${apiBase}/list-tables/`)
      .then((response) => {
        setTableList(response.data); // espera un array de strings
      })
      .catch((error) => {
        console.error("Error fetching table list:", error);
        toast.error("Failed to fetch table list");
      });
  }, []);

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  const callApi = async (
    url: string,
    options?: RequestInit,
    actionName?: string
  ) => {
    try {
      setLoading(actionName || null);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      toast.success(`${actionName} completed successfully`);
      console.log(data);
    } catch (error: any) {
      toast.error(`${actionName} failed: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleExportSelected = () => {
    if (selectedTables.length === 0) {
      toast.info("Please select at least one table.");
      return;
    }

    if (!window.confirm("Are you sure you want to export the selected tables?")) return;

    callApi(
      `${apiBase}/export-csv/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tables: selectedTables }),
      },
      "Export CSV"
    );
  };

  const handleImportCsv = () => {
    if (selectedTables.length === 0) {
      toast.info("Please select at least one table.");
      return;
    }

    if (!window.confirm("Are you sure you want to import CSV for the selected tables?")) return;

    callApi(
      `${apiBase}/restore-csv/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tables: selectedTables }),
      },
      "Import CSV"
    );
  };

  const handleRestoreDB = () => {
    if (!window.confirm("This will restore the full database from the last backup. Are you sure?")) return;

    callApi(`${apiBase}/restoreCompleteDB/`, { method: "POST" }, "Restore DB");
  };

  const restoreStructure = () => {
    if (!window.confirm("This will restore the database to its initial structure. Are you sure?")) return;

    callApi(`${apiBase}/restoreCompleteDBStruckture/`, { method: "POST" }, "Restore DB 0");
  };

  const handleBackupDB = () => {
    if (!window.confirm("Do you want to back up the entire database?")) return;

    callApi(`${apiBase}/backupCompleteDB/`, { method: "POST" }, "Backup DB");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-bold">Select Tables to Export</h2>

      <div className="grid grid-cols-2 gap-2">
        {tableList.map((table) => (
          <label key={table} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedTables.includes(table)}
              onChange={() => toggleTableSelection(table)}
              className="form-checkbox"
            />
            <span>{table}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleExportSelected}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Export CSV"
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading === "Export CSV" ? "Exporting..." : "Export Selected tables CSV"}
      </button>

      <button
        onClick={handleImportCsv}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Import CSV"
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-orange-600 hover:bg-blue-700"
        }`}
      >
        {loading === "Import CSV" ? "Importing CSV..." : "Import Selected tables CSV"}
      </button>

      <button
        onClick={handleRestoreDB}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Restore DB"
            ? "bg-red-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-red-700"
        }`}
      >
        {loading === "Restore DB" ? "Restoring DB..." : "Restore Complete DB last backup"}
      </button>

      <button
        onClick={handleBackupDB}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Backup DB"
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading === "Backup DB" ? "Backing up DB..." : "Backup Complete DB"}
      </button>

      <button
        onClick={restoreStructure}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Restore DB 0"
            ? "bg-red-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading === "Restore DB 0" ? "Restoring DB..." : "Restore by Initial DB"}
      </button>
    </div>
  );
};

export default BackupsIndex;
