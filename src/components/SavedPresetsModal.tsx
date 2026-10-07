import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, FolderDown, FolderUp, Check, Play } from 'lucide-react';
import { QRStyleState, QRContentState } from '../types';

interface SavedItem {
  id: string;
  name: string;
  savedAt: string;
  style: QRStyleState;
  content: QRContentState;
}

interface SavedPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: QRStyleState;
  currentContent: QRContentState;
  onLoadPreset: (item: SavedItem) => void;
}

const STORAGE_KEY = 'qr_studio_saved_presets_v1';

export const SavedPresetsModal: React.FC<SavedPresetsModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  currentContent,
  onLoadPreset
}) => {
  const [presets, setPresets] = useState<SavedItem[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadFromStorage();
    }
  }, [isOpen]);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setPresets(JSON.parse(raw));
      } else {
        setPresets([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveCurrent = () => {
    const name = newPresetName.trim() || `Design #${presets.length + 1}`;
    const newItem: SavedItem = {
      id: Date.now().toString(),
      name,
      savedAt: new Date().toLocaleDateString(),
      style: currentStyle,
      content: currentContent
    };

    const updated = [newItem, ...presets];
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewPresetName('');
    showToast('Saved current design to presets!');
  };

  const handleDelete = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-studio-presets-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const combined = [...imported, ...presets];
          setPresets(combined);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
          showToast(`Imported ${imported.length} preset(s)!`);
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">My Saved QR Presets</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Save your current customized layout or reload previous creations (stored in browser local storage).
        </p>

        {toastMsg && (
          <div className="mb-3 px-3 py-1.5 rounded-lg bg-pink-500/20 text-pink-600 dark:text-pink-300 text-xs flex items-center gap-1.5 border border-pink-500/30">
            <Check className="w-3.5 h-3.5" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Save Current Design Box */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl mb-4 flex items-center gap-2">
          <input
            type="text"
            value={newPresetName}
            onChange={e => setNewPresetName(e.target.value)}
            placeholder="Name your design (e.g. My Anniversary Card)..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={handleSaveCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>

        {/* Preset List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {presets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No saved designs yet. Name your current style above and click "Save"!
            </div>
          ) : (
            presets.map(item => (
              <div
                key={item.id}
                className="p-3 bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-300 transition">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Saved on {item.savedAt} • {item.style.frame.type} • {item.content.type.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onLoadPreset(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition"
                  >
                    <Play className="w-3 h-3 fill-indigo-300" />
                    <span>Load</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                    title="Delete preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Backup Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer">
            <FolderUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import JSON</span>
            <input
              type="file"
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportJSON}
            disabled={presets.length === 0}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-40 transition"
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
