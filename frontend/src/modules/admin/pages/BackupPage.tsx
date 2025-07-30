import React from 'react';
import { downloadBackup } from '../api/backup';

const BackupPage: React.FC = () => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleBackup = async (type: 'general' | 'clientes') => {
    setLoading(type);
    try {
      if (type === 'general') {
        await downloadBackup('/core/backup/general/', 'backup_general.backup');
      } else {
        await downloadBackup('/core/backup/clientes/', 'backup_clientes.backup');
      }
    } catch (e) {
      alert('Error al generar el backup.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center">
        <span className="mr-2">🔄</span> Generar Backups
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto flex flex-col gap-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow disabled:opacity-60"
          id="backup-general-btn"
          onClick={() => handleBackup('general')}
          disabled={loading === 'general'}
        >
          <span>🌎</span> {loading === 'general' ? 'Generando...' : 'Backup General'}
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow disabled:opacity-60"
          id="backup-clientes-btn"
          onClick={() => handleBackup('clientes')}
          disabled={loading === 'clientes'}
        >
          <span>👥</span> {loading === 'clientes' ? 'Generando...' : 'Backup Clientes'}
        </button>
      </div>
    </div>
  );
};

export default BackupPage;
