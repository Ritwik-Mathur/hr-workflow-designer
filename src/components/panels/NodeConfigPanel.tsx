import { useWorkflowStore } from '../../store/workflowStore';
import { StartNodeForm } from '../forms/StartNodeForm';
import { TaskNodeForm } from '../forms/TaskNodeForm';
import { ApprovalNodeForm } from '../forms/ApprovalNodeForm';
import { AutomatedNodeForm } from '../forms/AutomatedNodeForm';
import { EndNodeForm } from '../forms/EndNodeForm';
import type { WorkflowNodeData } from '../../types/workflow';
import { X, Trash2 } from 'lucide-react';

const NODE_LABELS: Record<string, string> = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step',
  end: 'End Node',
};

const TYPE_COLORS: Record<string, string> = {
  start: '#22c55e',
  task: '#3b82f6',
  approval: '#a855f7',
  automated: '#f97316',
  end: '#ef4444',
};

export function NodeConfigPanel() {
  const { nodes, selectedNodeId, updateNodeData, selectNode, deleteNode } = useWorkflowStore();

  if (!selectedNodeId) return null;

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const { data } = node;
  const type = data.type;
  const color = TYPE_COLORS[type] || '#888';

  const handleChange = (partial: Partial<WorkflowNodeData>) => {
    updateNodeData(selectedNodeId, partial);
  };

  return (
    <div className="config-panel">
      <div className="config-header" style={{ borderTopColor: color }}>
        <div className="config-title-row">
          <div>
            <span className="config-type-label" style={{ color }}>
              {NODE_LABELS[type]}
            </span>
            <div className="config-node-id">{selectedNodeId}</div>
          </div>
          <div className="config-actions">
            <button
              className="btn-icon danger"
              onClick={() => deleteNode(selectedNodeId)}
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <button className="btn-icon" onClick={() => selectNode(null)} title="Close">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="config-body">
        {type === 'start' && (
          <StartNodeForm data={data as any} onChange={handleChange} />
        )}
        {type === 'task' && (
          <TaskNodeForm data={data as any} onChange={handleChange} />
        )}
        {type === 'approval' && (
          <ApprovalNodeForm data={data as any} onChange={handleChange} />
        )}
        {type === 'automated' && (
          <AutomatedNodeForm data={data as any} onChange={handleChange} />
        )}
        {type === 'end' && (
          <EndNodeForm data={data as any} onChange={handleChange} />
        )}
      </div>
    </div>
  );
}
