import type { ApprovalNodeData } from '../../types/workflow';

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'];

interface Props {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

export function ApprovalNodeForm({ data, onChange }: Props) {
  return (
    <div className="node-form">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Approval step title..."
        />
      </div>
      <div className="form-group">
        <label className="form-label">Approver Role</label>
        <select
          className="form-input form-select"
          value={data.approverRole || 'Manager'}
          onChange={(e) => onChange({ approverRole: e.target.value })}
        >
          {APPROVER_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Auto-Approve Threshold</label>
        <div className="form-hint">Minimum number of approvers required</div>
        <input
          className="form-input"
          type="number"
          min={1}
          max={10}
          value={data.threshold ?? 1}
          onChange={(e) => onChange({ threshold: parseInt(e.target.value) || 1 })}
        />
      </div>
    </div>
  );
}
