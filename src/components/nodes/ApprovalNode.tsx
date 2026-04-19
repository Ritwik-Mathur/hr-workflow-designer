import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { ApprovalNodeData } from '../../types/workflow';
import { Shield, Users } from 'lucide-react';

function ApprovalNode({ data, selected }: NodeProps<ApprovalNodeData>) {
  return (
    <div className={`workflow-node approval-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle handle-target" />
      <div className="node-header">
        <span className="node-badge approval-badge">APPROVAL</span>
        <div className="node-icon approval-icon">
          <Shield size={12} />
        </div>
      </div>
      <div className="node-title">{data.label}</div>
      <div className="node-footer">
        {data.approverRole && (
          <span className="node-chip">
            <Users size={10} /> {data.approverRole}
          </span>
        )}
        {data.threshold !== undefined && (
          <span className="node-chip">Threshold: {data.threshold}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle handle-source" />
    </div>
  );
}

export default memo(ApprovalNode);
