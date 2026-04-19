import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { EndNodeData } from '../../types/workflow';
import { CircleOff } from 'lucide-react';

function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  return (
    <div className={`workflow-node end-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle handle-target" />
      <div className="node-header">
        <span className="node-badge end-badge">END</span>
        <div className="node-icon end-icon">
          <CircleOff size={12} />
        </div>
      </div>
      <div className="node-title">{data.label}</div>
      {data.endMessage && (
        <div className="node-meta">{data.endMessage}</div>
      )}
    </div>
  );
}

export default memo(EndNode);
