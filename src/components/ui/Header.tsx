import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulate } from '../../hooks/useSimulate';
import { Play, Download, Upload, Trash2, Moon, Sun, Workflow } from 'lucide-react';
import { useRef } from 'react';

export function Header() {
  const {
    nodes,
    edges,
    workflowName,
    setWorkflowName,
    exportWorkflow,
    importWorkflow,
    clearWorkflow,
    toggleDark,
    isDark,
  } = useWorkflowStore();

  const { runSimulation, isSimulating } = useSimulate();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) importWorkflow(ev.target.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-icon">
            <Workflow size={18} />
          </div>
          <div className="logo-text">
            <span className="logo-brand">Tredence</span>
            <span className="logo-sub">HR Workflow Designer</span>
          </div>
        </div>
        <div className="header-divider" />
        <input
          className="workflow-name-input"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
        />
        <div className="header-stats">
          <span className="stat-badge">{nodes.length} nodes</span>
          <span className="stat-badge">{edges.length} edges</span>
        </div>
      </div>

      <div className="header-right">
        <button
          className="btn-simulate"
          onClick={runSimulation}
          disabled={isSimulating}
        >
          <Play size={14} fill="currentColor" />
          {isSimulating ? 'Running…' : 'Simulate'}
        </button>

        <div className="header-tools">
          <button className="header-tool-btn" onClick={handleExport} title="Export JSON">
            <Download size={16} />
          </button>
          <button className="header-tool-btn" onClick={() => fileRef.current?.click()} title="Import JSON">
            <Upload size={16} />
          </button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          <button className="header-tool-btn danger" onClick={() => { if (confirm('Clear all nodes and edges?')) clearWorkflow(); }} title="Clear canvas">
            <Trash2 size={16} />
          </button>
          <button className="header-tool-btn" onClick={toggleDark} title="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
