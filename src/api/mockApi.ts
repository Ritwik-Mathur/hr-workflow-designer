import type { AutomationAction, SimulationResult, SimulationStep } from '../types/workflow';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';

// Mock automation actions — GET /automations
export const mockAutomations: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary', 'assignee'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'title', 'date'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return mockAutomations;
}

// POST /simulate
export async function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Promise<SimulationResult> {
  await delay(600);

  const errors: string[] = [];
  const steps: SimulationStep[] = [];

  // Validate: must have a start node
  const startNodes = nodes.filter((n) => n.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start Node.');
  }
  if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start Node.');
  }

  // Validate: must have an end node
  const endNodes = nodes.filter((n) => n.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have an End Node.');
  }

  // Validate: all non-end nodes should have outgoing edges
  const nodeIds = new Set(nodes.map((n) => n.id));
  const sourceIds = new Set(edges.map((e) => e.source));
  const targetIds = new Set(edges.map((e) => e.target));

  for (const node of nodes) {
    if (node.data.type !== 'end' && !sourceIds.has(node.id)) {
      errors.push(`Node "${node.data.label}" has no outgoing connection.`);
    }
    if (node.data.type !== 'start' && !targetIds.has(node.id)) {
      errors.push(`Node "${node.data.label}" has no incoming connection.`);
    }
  }

  // Check for cycles (simple DFS)
  if (hasCycle(nodes, edges)) {
    errors.push('Workflow contains a cycle, which is not allowed.');
  }

  if (errors.length > 0) {
    return { success: false, steps: [], errors, totalDuration: 0 };
  }

  // Build execution order via topological sort
  const ordered = topologicalSort(nodes, edges);
  let totalDuration = 0;

  for (const node of ordered) {
    const duration = getSimDuration(node.data.type);
    totalDuration += duration;
    steps.push(buildStep(node, duration));
  }

  return { success: true, steps, errors: [], totalDuration };
}

function buildStep(node: Node<WorkflowNodeData>, duration: number): SimulationStep {
  const { type, label } = node.data;

  const messages: Record<string, string> = {
    start: `Workflow '${label}' initiated.`,
    task: `Task '${label}' assigned to ${(node.data as any).assignee || 'unassigned'}. Due: ${(node.data as any).dueDate || 'N/A'}.`,
    approval: `Approval requested from ${(node.data as any).approverRole || 'Manager'}. Threshold: ${(node.data as any).threshold || 1} approver(s).`,
    automated: `Automated action '${(node.data as any).actionId || 'action'}' executed with provided parameters.`,
    end: `Workflow completed. ${(node.data as any).endMessage || ''}`,
  };

  const statuses: Record<string, SimulationStep['status']> = {
    start: 'success',
    task: 'success',
    approval: 'pending',
    automated: 'success',
    end: 'success',
  };

  return {
    nodeId: node.id,
    nodeType: type,
    label,
    status: statuses[type] || 'success',
    message: messages[type] || 'Executed.',
    duration,
  };
}

function getSimDuration(type: string): number {
  const map: Record<string, number> = {
    start: 128,
    task: 1387,
    approval: 3518,
    automated: 993,
    end: 210,
  };
  return map[type] || 500;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function hasCycle(nodes: Node[], edges: Edge[]): boolean {
  const adj: Record<string, string[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) adj[e.source]?.push(e.target);

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(id: string): boolean {
    visited.add(id);
    stack.add(id);
    for (const neighbor of adj[id] || []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (stack.has(neighbor)) return true;
    }
    stack.delete(id);
    return false;
  }

  for (const n of nodes) {
    if (!visited.has(n.id) && dfs(n.id)) return true;
  }
  return false;
}

function topologicalSort(nodes: Node<WorkflowNodeData>[], edges: Edge[]): Node<WorkflowNodeData>[] {
  const adj: Record<string, string[]> = {};
  const inDeg: Record<string, number> = {};

  for (const n of nodes) {
    adj[n.id] = [];
    inDeg[n.id] = 0;
  }
  for (const e of edges) {
    adj[e.source].push(e.target);
    inDeg[e.target]++;
  }

  const queue = nodes.filter((n) => inDeg[n.id] === 0);
  const result: Node<WorkflowNodeData>[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of adj[node.id]) {
      inDeg[neighbor]--;
      if (inDeg[neighbor] === 0) {
        const found = nodes.find((n) => n.id === neighbor);
        if (found) queue.push(found);
      }
    }
  }

  return result;
}
