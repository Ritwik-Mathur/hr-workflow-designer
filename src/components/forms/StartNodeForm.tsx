import { useState } from 'react';
import type { StartNodeData } from '../../types/workflow';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export function StartNodeForm({ data, onChange }: Props) {
  const [metaKey, setMetaKey] = useState('');
  const [metaVal, setMetaVal] = useState('');

  const meta = data.metadata || {};

  const addMeta = () => {
    if (metaKey.trim()) {
      onChange({ metadata: { ...meta, [metaKey]: metaVal } });
      setMetaKey('');
      setMetaVal('');
    }
  };

  const removeMeta = (key: string) => {
    const next = { ...meta };
    delete next[key];
    onChange({ metadata: next });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">Workflow Title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Start title..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Trigger Source</label>
        <input
          className="form-input"
          value={data.trigger || ''}
          onChange={(e) => onChange({ trigger: e.target.value })}
          placeholder="e.g. HR Portal, API, Manual"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Metadata (Optional)</label>
        <div className="kv-row">
          <input
            className="form-input"
            value={metaKey}
            onChange={(e) => setMetaKey(e.target.value)}
            placeholder="Key"
          />
          <input
            className="form-input"
            value={metaVal}
            onChange={(e) => setMetaVal(e.target.value)}
            placeholder="Value"
          />
          <button className="btn-icon" onClick={addMeta} title="Add">
            <Plus size={14} />
          </button>
        </div>
        {Object.entries(meta).map(([k, v]) => (
          <div key={k} className="kv-chip">
            <span>{k}: {v}</span>
            <button className="btn-icon-sm" onClick={() => removeMeta(k)}>
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
