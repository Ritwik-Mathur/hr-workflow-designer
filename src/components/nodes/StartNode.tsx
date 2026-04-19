import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { StartNodeData } from '../../types/workflow';
import { Play } from 'lucide-react';

function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  return (
    <div className={`workflow-node start-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <span className="node-badge start-badge">START</span>
        <div className="node-icon start-icon">
          <Play size={12} fill="currentColor" />
        </div>
      </div>
      <div className="node-title">{data.label}</div>
      {data.trigger && (
        <div className="node-meta">trigger: {data.trigger}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="node-handle handle-source" />
    </div>
  );
}

export default memo(StartNode);
