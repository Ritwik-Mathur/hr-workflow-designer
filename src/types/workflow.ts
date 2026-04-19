export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData {
  type: NodeType;
  label: string;
  isValid?: boolean;
  validationError?: string;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  trigger?: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  approverRole?: string;
  threshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId?: string;
  actionLabel?: string;
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage?: string;
  showSummary?: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  label: string;
  status: 'success' | 'pending' | 'error' | 'skipped';
  message: string;
  duration: number;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  totalDuration: number;
}
