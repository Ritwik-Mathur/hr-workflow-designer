import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { simulateWorkflow } from '../api/mockApi';

export function useSimulate() {
  const {
    nodes,
    edges,
    setShowSimPanel,
    setSimResult,
    setIsSimulating,
    simResult,
    isSimulating,
    showSimPanel,
  } = useWorkflowStore();

  const runSimulation = useCallback(async () => {
    setShowSimPanel(true);
    setSimResult(null);
    setIsSimulating(true);

    try {
      const result = await simulateWorkflow(nodes as any, edges);
      setSimResult(result);
    } catch (err) {
      setSimResult({
        success: false,
        steps: [],
        errors: ['Simulation failed with an unexpected error.'],
        totalDuration: 0,
      });
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, setShowSimPanel, setSimResult, setIsSimulating]);

  return { runSimulation, simResult, isSimulating, showSimPanel };
}
