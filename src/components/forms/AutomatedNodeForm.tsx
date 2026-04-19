import { useEffect } from 'react';
import type { AutomatedNodeData } from '../../types/workflow';
import { useAutomations } from '../../hooks/useAutomations';

interface Props {
  data: AutomatedNodeData;
  onChange: (data: Partial<AutomatedNodeData>) => void;
}

export function AutomatedNodeForm({ data, onChange }: Props) {
  const { automations } = useAutomations();

  const selected = automations.find((a) => a.id === data.actionId);

  useEffect(() => {
    if (automations.length > 0 && !data.actionId) {
      const first = automations[0];
      onChange({ actionId: first.id, actionLabel: first.label, actionParams: {} });
    }
  }, [automations]);

  const handleActionChange = (id: string) => {
    const action = automations.find((a) => a.id === id);
    if (action) {
      onChange({ actionId: action.id, actionLabel: action.label, actionParams: {} });
    }
  };

  const handleParamChange = (param: string, value: string) => {
    onChange({
      actionParams: { ...(data.actionParams || {}), [param]: value },
    });
  };

  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Automated step title..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Action</label>
        <select
          className="form-input form-select"
          value={data.actionId || ''}
          onChange={(e) => handleActionChange(e.target.value)}
        >
          {automations.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>
      {selected && selected.params.length > 0 && (
        <div className="form-group">
          <label className="form-label">Action Parameters</label>
          {selected.params.map((param) => (
            <div key={param} className="param-row">
              <span className="param-label">{param}</span>
              <input
                className="form-input"
                value={data.actionParams?.[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
