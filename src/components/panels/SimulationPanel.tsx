import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulate } from '../../hooks/useSimulate';
import type { SimulationStep } from '../../types/workflow';
import { X, CheckCircle2, Clock, XCircle, Play, Loader2, AlertTriangle } from 'lucide-react';

const STATUS_ICON: Record<string, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="sim-icon success" />,
  pending: <Clock size={16} className="sim-icon pending" />,
  error: <XCircle size={16} className="sim-icon error" />,
  skipped: <Clock size={16} className="sim-icon skipped" />,
};

const STATUS_COLOR: Record<string, string> = {
  success: '#22c55e',
  pending: '#f59e0b',
  error: '#ef4444',
  skipped: '#6b7280',
};

const NODE_TYPE_BADGE: Record<string, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automated: 'Automated',
  end: 'End',
};

function StepRow({ step, index }: { step: SimulationStep; index: number }) {
  return (
    <div className="sim-step" style={{ animationDelay: `${index * 120}ms` }}>
      <div className="sim-step-header">
        {STATUS_ICON[step.status]}
        <span className="sim-step-label">{step.label}</span>
        <span className="sim-type-badge">{NODE_TYPE_BADGE[step.nodeType]}</span>
        <span className="sim-status-text" style={{ color: STATUS_COLOR[step.status] }}>
          {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
        </span>
      </div>
      <div className="sim-step-body">
        <p className="sim-message">{step.message}</p>
        <span className="sim-duration">~{step.duration}ms</span>
      </div>
    </div>
  );
}

export function SimulationPanel() {
  const { setShowSimPanel } = useWorkflowStore();
  const { simResult, isSimulating, runSimulation } = useSimulate();

  return (
    <div className="sim-panel">
      <div className="sim-panel-header">
        <div>
          <div className="sim-panel-eyebrow">WORKFLOW SANDBOX</div>
          <div className="sim-panel-title">Test &amp; Simulate</div>
        </div>
        <button className="btn-icon" onClick={() => setShowSimPanel(false)}>
          <X size={16} />
        </button>
      </div>

      <div className="sim-actions">
        <button
          className="btn-simulate-run"
          onClick={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <><Loader2 size={14} className="spin" /> Running…</>
          ) : (
            <><Play size={14} fill="currentColor" /> Re-run</>
          )}
        </button>
      </div>

      <div className="sim-timeline-label">EXECUTION TIMELINE</div>

      {isSimulating && (
        <div className="sim-loading">
          <Loader2 size={24} className="spin" />
          <span>Simulating workflow…</span>
        </div>
      )}

      {!isSimulating && simResult && (
        <div className="sim-results">
          {simResult.errors.length > 0 && (
            <div className="sim-errors">
              {simResult.errors.map((err, i) => (
                <div key={i} className="sim-error-item">
                  <AlertTriangle size={13} />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {simResult.steps.map((step, i) => (
            <StepRow key={step.nodeId} step={step} index={i} />
          ))}

          {simResult.steps.length > 0 && (
            <div className="sim-summary">
              <span>Total execution time</span>
              <span className="sim-total-time">{simResult.totalDuration}ms</span>
            </div>
          )}
        </div>
      )}

      {!isSimulating && !simResult && (
        <div className="sim-empty">
          <Play size={32} />
          <p>Click "Simulate" in the header or "Re-run" to test your workflow.</p>
        </div>
      )}
    </div>
  );
}
