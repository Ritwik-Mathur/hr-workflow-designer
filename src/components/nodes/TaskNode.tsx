import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { TaskNodeData } from '../../types/workflow';
import { CheckSquare, User, Calendar } from 'lucide-react';

function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <div className={`workflow-node task-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle handle-target" />
      <div className="node-header">
        <span className="node-badge task-badge">TASK</span>
        <div className="node-icon task-icon">
          <CheckSquare size={12} />
        </div>
      </div>
      <div className="node-title">{data.label}</div>
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      <div className="node-footer">
        {data.assignee && (
          <span className="node-chip">
            <User size={10} /> {data.assignee}
          </span>
        )}
        {data.dueDate && (
          <span className="node-chip">
            <Calendar size={10} /> {data.dueDate}
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle handle-source" />
    </div>
  );
}

export default memo(TaskNode);
