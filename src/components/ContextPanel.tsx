import React from 'react';
import {
  FileText,
  FileCode,
  FolderTree,
  CheckSquare,
  FilePlus,
  FileEdit,
  Folder,
  File,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import type { ContextSection } from '../contracts/presentation';
import {
  DEMO_REFERENCED_FILES,
  DEMO_MODIFIED_FILES,
  DEMO_WORKSPACE_FILES,
  DEMO_TODOS,
} from '../mocks/frontendDemoData';
import { Tabs, Panel, Badge } from './ui';
import type { TabItem } from './ui';

export const ContextPanel: React.FC = () => {
  const { activeContextSection, setActiveContextSection } = useUiStore();

  const sections: TabItem<ContextSection>[] = [
    {
      id: 'referenced',
      label: 'Referenced',
      icon: <FileText className="w-3.5 h-3.5" />,
      count: DEMO_REFERENCED_FILES.length,
    },
    {
      id: 'modified',
      label: 'Modified',
      icon: <FileCode className="w-3.5 h-3.5" />,
      count: DEMO_MODIFIED_FILES.length,
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: <FolderTree className="w-3.5 h-3.5" />,
      count: DEMO_WORKSPACE_FILES.length,
    },
    {
      id: 'todos',
      label: 'Todos',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      count: DEMO_TODOS.length,
    },
  ];

  return (
    <Panel
      title="Workspace & Context"
      badge={<Badge>Phase 1A</Badge>}
      footer="Note: Workspace panel displays frontend demo representation."
      bodyClassName="p-3"
    >
      <Tabs items={sections} activeId={activeContextSection} onChange={setActiveContextSection} />

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Referenced Files View */}
        {activeContextSection === 'referenced' && (
          <div className="space-y-2">
            <div className="text-[11px] font-medium text-slate-400 mb-2">
              Files explicitly attached to model prompt context
            </div>
            {DEMO_REFERENCED_FILES.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">No files referenced.</div>
            ) : (
              DEMO_REFERENCED_FILES.map((file) => (
                <div
                  key={file.id}
                  className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="font-mono text-slate-200 truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modified Files View */}
        {activeContextSection === 'modified' && (
          <div className="space-y-2">
            <div className="text-[11px] font-medium text-slate-400 mb-2">
              Uncommitted diff modifications in current task
            </div>
            {DEMO_MODIFIED_FILES.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">No files modified.</div>
            ) : (
              DEMO_MODIFIED_FILES.map((file) => (
                <div
                  key={file.id}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      {file.status === 'added' ? (
                        <FilePlus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <FileEdit className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-mono text-slate-200 truncate">{file.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        file.status === 'added'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {file.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pl-5">
                    <span className="truncate text-slate-500">{file.path}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {file.linesAdded !== undefined && (
                        <span className="text-emerald-400">+{file.linesAdded}</span>
                      )}
                      {file.linesRemoved !== undefined && (
                        <span className="text-red-400">-{file.linesRemoved}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Workspace Browser View */}
        {activeContextSection === 'workspace' && (
          <div className="space-y-1">
            <div className="text-[11px] font-medium text-slate-400 mb-2">
              Local repository file tree browser
            </div>
            {DEMO_WORKSPACE_FILES.map((item) => (
              <div
                key={item.id}
                className={`p-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-900 transition-colors ${
                  item.isDir ? 'font-semibold text-slate-200' : 'text-slate-300 font-mono'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {item.isDir ? (
                    <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
                {item.size && (
                  <span className="text-[10px] text-slate-500 font-mono">{item.size}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Todos View */}
        {activeContextSection === 'todos' && (
          <div className="space-y-2">
            <div className="text-[11px] font-medium text-slate-400 mb-2">
              Task list and implementation roadmap checklist
            </div>
            {DEMO_TODOS.map((todo) => (
              <div
                key={todo.id}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
                  todo.completed
                    ? 'bg-slate-950/40 border-slate-800/50 text-slate-500 line-through'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200'
                }`}
              >
                {todo.completed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="text-xs font-medium leading-snug">{todo.task}</div>
                  <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-400">
                    {todo.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
};
