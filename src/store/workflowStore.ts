import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import type { WorkflowNodeData, NodeType, SimulationResult } from '../types/workflow';

interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  workflowName: string;
  showSimPanel: boolean;
  simResult: SimulationResult | null;
  isSimulating: boolean;
  isDark: boolean;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  selectNode: (id: string | null) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;

  setWorkflowName: (name: string) => void;
  setShowSimPanel: (show: boolean) => void;
  setSimResult: (result: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
  toggleDark: () => void;

  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
  clearWorkflow: () => void;
}

const defaultNodes: Node<WorkflowNodeData>[] = [
  {
    id: 'node-start-1',
    type: 'startNode',
    position: { x: 320, y: 60 },
    data: { type: 'start', label: 'Employee Onboarding', trigger: 'HR Portal' },
  },
  {
    id: 'node-task-1',
    type: 'taskNode',
    position: { x: 270, y: 210 },
    data: {
      type: 'task',
      label: 'Collect Documents',
      description: 'Gather ID, offer letter, and bank details.',
      assignee: 'hr@company.com',
      dueDate: '2025-05-15',
    },
  },
  {
    id: 'node-approval-1',
    type: 'approvalNode',
    position: { x: 280, y: 390 },
    data: {
      type: 'approval',
      label: 'Manager Approval',
      approverRole: 'Manager',
      threshold: 1,
    },
  },
  {
    id: 'node-auto-1',
    type: 'automatedNode',
    position: { x: 270, y: 570 },
    data: {
      type: 'automated',
      label: 'Send Welcome Email',
      actionId: 'send_email',
      actionLabel: 'Send Email',
      actionParams: { to: 'employee@company.com', subject: 'Welcome to Tredence!' },
    },
  },
  {
    id: 'node-end-1',
    type: 'endNode',
    position: { x: 310, y: 750 },
    data: {
      type: 'end',
      label: 'Onboarding Complete',
      endMessage: 'Employee successfully onboarded.',
      showSummary: true,
    },
  },
];

const defaultEdges: Edge[] = [
  { id: 'e1', source: 'node-start-1', target: 'node-task-1', animated: false },
  { id: 'e2', source: 'node-task-1', target: 'node-approval-1', animated: false },
  { id: 'e3', source: 'node-approval-1', target: 'node-auto-1', animated: false },
  { id: 'e4', source: 'node-auto-1', target: 'node-end-1', animated: false },
];

const defaultNodeData: Record<NodeType, Partial<WorkflowNodeData>> = {
  start: { type: 'start', label: 'Start', trigger: 'HR Portal' },
  task: { type: 'task', label: 'New Task', description: '', assignee: '', dueDate: '' },
  approval: { type: 'approval', label: 'Approval Step', approverRole: 'Manager', threshold: 1 },
  automated: { type: 'automated', label: 'Automated Step', actionId: '', actionParams: {} },
  end: { type: 'end', label: 'End', endMessage: 'Workflow complete.', showSummary: false },
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: defaultNodes,
  edges: defaultEdges,
  selectedNodeId: null,
  workflowName: 'Employee Onboarding',
  showSimPanel: false,
  simResult: null,
  isSimulating: false,
  isDark: false,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<WorkflowNodeData>[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection: Connection) => {
    set({ edges: addEdge({ ...connection, id: uuidv4() }, get().edges) });
  },

  addNode: (type, position) => {
    const id = `node-${type}-${uuidv4().slice(0, 8)}`;
    const typeMap: Record<NodeType, string> = {
      start: 'startNode',
      task: 'taskNode',
      approval: 'approvalNode',
      automated: 'automatedNode',
      end: 'endNode',
    };
    const newNode: Node<WorkflowNodeData> = {
      id,
      type: typeMap[type],
      position,
      data: { ...defaultNodeData[type] } as WorkflowNodeData,
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    });
  },

  selectNode: (id) => set({ selectedNodeId: id }),
  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },
  deleteEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
  },

  setWorkflowName: (name) => set({ workflowName: name }),
  setShowSimPanel: (show) => set({ showSimPanel: show }),
  setSimResult: (result) => set({ simResult: result }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  toggleDark: () => set({ isDark: !get().isDark }),

  exportWorkflow: () => {
    const { nodes, edges, workflowName } = get();
    return JSON.stringify({ workflowName, nodes, edges }, null, 2);
  },
  importWorkflow: (json) => {
    try {
      const { workflowName, nodes, edges } = JSON.parse(json);
      set({ workflowName, nodes, edges, selectedNodeId: null });
    } catch {
      alert('Invalid workflow JSON');
    }
  },
  clearWorkflow: () => {
    set({ nodes: [], edges: [], selectedNodeId: null, simResult: null });
  },
}));
