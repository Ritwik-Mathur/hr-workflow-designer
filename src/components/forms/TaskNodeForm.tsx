import { useState } from 'react';
import type { TaskNodeData } from '../../types/workflow';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export function TaskNodeForm({ data, onChange }: Props) {
  const [cfKey, setCfKey] = useState('');
  const [cfVal, setCfVal] = useState('');
  const cf = data.customFields || {};

  const addCf = () => {
    if (cfKey.trim()) {
      onChange({ customFields: { ...cf, [cfKey]: cfVal } });
      setCfKey('');
      setCfVal('');
    }
  };
  const removeCf = (k: string) => {
    const n = { ...cf };
    delete n[k];
    onChange({ customFields: n });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">Title <span className="required">*</span></label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Task title..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input form-textarea"
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe what needs to be done..."
          rows={3}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Assignee</label>
        <input
          className="form-input"
          value={data.assignee || ''}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="e.g. hr@company.com"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Due Date</label>
        <input
          className="form-input"
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Custom Fields</label>
        <div className="kv-row">
          <input
            className="form-input"
            value={cfKey}
            onChange={(e) => setCfKey(e.target.value)}
            placeholder="Key"
          />
          <input
            className="form-input"
            value={cfVal}
            onChange={(e) => setCfVal(e.target.value)}
            placeholder="Value"
          />
          <button className="btn-icon" onClick={addCf}>
            <Plus size={14} />
          </button>
        </div>
        {Object.entries(cf).map(([k, v]) => (
          <div key={k} className="kv-chip">
            <span>{k}: {v}</span>
            <button className="btn-icon-sm" onClick={() => removeCf(k)}>
              <Trash2 size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
