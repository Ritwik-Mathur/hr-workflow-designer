import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { AutomatedNodeData } from '../../types/workflow';
import { Zap } from 'lucide-react';

function AutomatedNode({ data, selected }: NodeProps<AutomatedNodeData>) {
  return (
    <div className={`workflow-node automated-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle handle-target" />
      <div className="node-header">
        <span className="node-badge automated-badge">AUTOMATED</span>
        <div className="node-icon automated-icon">
          <Zap size={12} />
        </div>
      </div>
      <div className="node-title">{data.label}</div>
      {data.actionLabel && (
        <div className="node-meta">{data.actionLabel}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="node-handle handle-source" />
    </div>
  );
}

export default memo(AutomatedNode);
