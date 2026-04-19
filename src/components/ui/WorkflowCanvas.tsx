import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  type ReactFlowInstance,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';
import type { NodeType } from '../../types/workflow';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    addNode,
    isDark,
  } = useWorkflowStore();

  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/workflow-node-type') as NodeType;
      if (!type || !rfInstanceRef.current) return;

      const bounds = (event.target as HTMLElement)
        .closest('.react-flow')
        ?.getBoundingClientRect();
      if (!bounds) return;

      const position = rfInstanceRef.current.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(type, position);
    },
    [addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={(instance) => { rfInstanceRef.current = instance; }}
        fitView
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: isDark ? '#4b5563' : '#d1d5db' },
          animated: false,
        }}
        connectionLineStyle={{ strokeWidth: 2, stroke: '#f97316' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isDark ? '#374151' : '#e5e7eb'}
        />
        <Controls
          className="canvas-controls"
          showInteractive={false}
        />
        <MiniMap
          className="canvas-minimap"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              startNode: '#22c55e',
              taskNode: '#3b82f6',
              approvalNode: '#a855f7',
              automatedNode: '#f97316',
              endNode: '#ef4444',
            };
            return colors[node.type || ''] || '#888';
          }}
          maskColor={isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'}
        />
      </ReactFlow>
    </div>
  );
}
