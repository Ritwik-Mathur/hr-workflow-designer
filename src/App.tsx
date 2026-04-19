import { useEffect } from 'react';
import { Header } from './components/ui/Header';
import { NodeSidebar } from './components/panels/NodeSidebar';
import { WorkflowCanvas } from './components/ui/WorkflowCanvas';
import { NodeConfigPanel } from './components/panels/NodeConfigPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { useWorkflowStore } from './store/workflowStore';
import './styles/index.css';

function App() {
  const { selectedNodeId, showSimPanel, isDark } = useWorkflowStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        <NodeSidebar />
        <main className="canvas-area">
          <WorkflowCanvas />
        </main>
        {selectedNodeId && !showSimPanel && <NodeConfigPanel />}
        {showSimPanel && <SimulationPanel />}
      </div>
    </div>
  );
}

export default App;
