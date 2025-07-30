import React, { useState } from "react";
import { toast } from "react-toastify";

const apiBase = "http://127.0.0.1:8000/api/v1/services";

const BackupsIndex = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const callApi = async (url: string, options?: RequestInit, actionName?: string) => {
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

  const handleExportCsv = () => {
    const tableName = prompt("Enter the name of the table to export:");
    if (!tableName) {
      toast.info("Export cancelled: No table name provided.");
      return;
    }

    callApi(
      `${apiBase}/export-csv/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableName }),
      },
      "Export CSV"
    );
  };

  const handleRestoreDB = () => {
    callApi(`${apiBase}/restoreCompleteDB/`, { method: "POST" }, "Restore DB");
  };

  const handleBackupDB = () => {
    callApi(`${apiBase}/backupCompleteDB/`, { method: "POST" }, "Backup DB");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <button
        onClick={handleExportCsv}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Export CSV" ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading === "Export CSV" ? "Exporting CSV..." : "Export CSV"}
      </button>

      <button
        onClick={handleRestoreDB}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Restore DB" ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading === "Restore DB" ? "Restoring DB..." : "Restore Complete DB"}
      </button>

      <button
        onClick={handleBackupDB}
        disabled={loading !== null}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition-colors ${
          loading === "Backup DB" ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading === "Backup DB" ? "Backing up DB..." : "Backup Complete DB"}
      </button>
    </div>
  );
};

export default BackupsIndex;
