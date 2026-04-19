import type { EndNodeData } from '../../types/workflow';

interface Props {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export function EndNodeForm({ data, onChange }: Props) {
  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">End Title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="End node title..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Completion Message</label>
        <textarea
          className="form-input form-textarea"
          value={data.endMessage || ''}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="e.g. Workflow completed successfully."
          rows={3}
        />
      </div>
      <div className="form-group">
        <label className="form-label toggle-label">
          <span>Show Summary Report</span>
          <div
            className={`toggle ${data.showSummary ? 'toggle-on' : ''}`}
            onClick={() => onChange({ showSummary: !data.showSummary })}
          >
            <div className="toggle-thumb" />
          </div>
        </label>
        <div className="form-hint">Display execution summary when workflow ends</div>
      </div>
    </div>
  );
}
