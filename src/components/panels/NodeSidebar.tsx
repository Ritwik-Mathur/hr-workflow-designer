import type { NodeType } from '../../types/workflow';
import { Play, CheckSquare, Shield, Zap, CircleOff, GripVertical } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

interface NodeTypeConfig {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const NODE_TYPES: NodeTypeConfig[] = [
  {
    type: 'start',
    label: 'Start Node',
    description: 'Workflow entry point',
    icon: <Play size={14} fill="currentColor" />,
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  {
    type: 'task',
    label: 'Task Node',
    description: 'Human task assignment',
    icon: <CheckSquare size={14} />,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.08)',
    borderColor: 'rgba(59,130,246,0.3)',
  },
  {
    type: 'approval',
    label: 'Approval Node',
    description: 'Manager/HR approval step',
    icon: <Shield size={14} />,
    color: '#a855f7',
    bgColor: 'rgba(168,85,247,0.08)',
    borderColor: 'rgba(168,85,247,0.3)',
  },
  {
    type: 'automated',
    label: 'Automated Step',
    description: 'System-triggered action',
    icon: <Zap size={14} />,
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.08)',
    borderColor: 'rgba(249,115,22,0.3)',
  },
  {
    type: 'end',
    label: 'End Node',
    description: 'Workflow completion',
    icon: <CircleOff size={14} />,
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
];

export function NodeSidebar() {
  const { addNode } = useWorkflowStore();

  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('application/workflow-node-type', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = (type: NodeType) => {
    addNode(type, { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 });
  };

  return (
    <aside className="node-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">NODE TYPES</span>
      </div>
      <div className="sidebar-nodes">
        {NODE_TYPES.map((nt) => (
          <div
            key={nt.type}
            className="sidebar-node-item"
            draggable
            onDragStart={(e) => onDragStart(e, nt.type)}
            onClick={() => handleClick(nt.type)}
            style={{
              '--node-color': nt.color,
              '--node-bg': nt.bgColor,
              '--node-border': nt.borderColor,
            } as React.CSSProperties}
          >
            <div className="sni-icon" style={{ color: nt.color, background: nt.bgColor }}>
              {nt.icon}
            </div>
            <div className="sni-text">
              <div className="sni-label" style={{ color: nt.color }}>{nt.label}</div>
              <div className="sni-desc">{nt.description}</div>
            </div>
            <GripVertical size={14} className="sni-drag" />
          </div>
        ))}
      </div>
      <div className="sidebar-hint">
        <p>Drag nodes to canvas or click to add</p>
      </div>
    </aside>
  );
}
