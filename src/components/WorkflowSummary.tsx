import React, { useState } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  FileCode2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { DEMO_WORKFLOW_STEPS } from '../mocks/frontendDemoData';
import { DemoWorkflowStep } from '../types/ui';

export const WorkflowSummary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStepIcon = (type: DemoWorkflowStep['type']) => {
    switch (type) {
      case 'step_started':
        return <PlayCircle className="w-3.5 h-3.5 text-blue-400" />;
      case 'tool_queued':
        return <Clock className="w-3.5 h-3.5 text-purple-400" />;
      case 'tool_running':
        return <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" />;
      case 'file_changed':
        return <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'attention_required':
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
      case 'tool_completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden mb-3">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-slate-300 hover:bg-slate-800/60 transition-colors focus-ring"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-200">Workflow Execution Timeline</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
            {DEMO_WORKFLOW_STEPS.length} events
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[11px] hidden sm:inline">
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 space-y-2 max-h-48 overflow-y-auto">
          <div className="relative pl-3 space-y-2.5 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-800">
            {DEMO_WORKFLOW_STEPS.map((step) => (
              <div key={step.id} className="relative flex items-start gap-2.5 text-xs">
                {/* Timeline Dot */}
                <div className="relative z-10 p-0.5 rounded-full bg-slate-900 border border-slate-700 mt-0.5">
                  {getStepIcon(step.type)}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-medium text-slate-200">{step.title}</span>
                    {step.detail && (
                      <p className="text-[11px] text-slate-400 leading-snug">{step.detail}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono shrink-0">
                    {step.duration && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {step.duration}
                      </span>
                    )}
                    <span>{step.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
