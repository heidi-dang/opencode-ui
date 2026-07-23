import React, { useState } from 'react';
import {
  Terminal,
  GitBranch,
  FolderGit2,
  Bot,
  Cpu,
  Sun,
  Moon,
  Laptop,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  WifiOff,
  Menu,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import { PrimaryNavigation } from './PrimaryNavigation';
import {
  DEMO_WORKSPACES,
  DEMO_BRANCHES,
  DEMO_AGENTS,
  DEMO_MODELS,
} from '../mocks/frontendDemoData';
import { AppearanceMode } from '../types/ui';

export const TopToolbar: React.FC = () => {
  const {
    appearance,
    setAppearance,
    leftPanelOpen,
    toggleLeftPanel,
    rightPanelOpen,
    toggleRightPanel,
    setMobileNavigationOpen,
    setMobileContextOpen,
  } = useUiStore();

  const [selectedWorkspace, setSelectedWorkspace] = useState(DEMO_WORKSPACES[0].id);
  const [selectedBranch, setSelectedBranch] = useState(DEMO_BRANCHES[1].id);
  const [selectedAgent, setSelectedAgent] = useState(DEMO_AGENTS[0].id);
  const [selectedModel, setSelectedModel] = useState(DEMO_MODELS[0].id);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleAppearanceCycle = () => {
    const modes: AppearanceMode[] = ['dark', 'light', 'system'];
    const currentIndex = modes.indexOf(appearance);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setAppearance(nextMode);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 py-2 transition-colors">
      <div className="flex items-center justify-between gap-2">
        {/* Left Section: Brand & Panel Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Sessions Drawer Toggle */}
          <button
            onClick={() => setMobileNavigationOpen(true)}
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus-ring"
            aria-label="Open sessions drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Left Panel Desktop Toggle */}
          <button
            onClick={toggleLeftPanel}
            type="button"
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-ring"
            aria-label={leftPanelOpen ? 'Collapse left panel' : 'Expand left panel'}
            title={leftPanelOpen ? 'Collapse left panel' : 'Expand left panel'}
          >
            {leftPanelOpen ? (
              <PanelLeftClose className="w-4 h-4 text-amber-500" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          {/* Logo / Brand */}
          <div className="flex items-center gap-2 pl-1 pr-2 border-r border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-xs">
              <Terminal className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                OpenCode
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Phase 1A
                </span>
              </span>
            </div>
          </div>

          {/* Selectors Group (Workspace, Branch, Agent, Model) */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Workspace Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('workspace')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 focus-ring"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[110px] truncate">
                  {DEMO_WORKSPACES.find((w) => w.id === selectedWorkspace)?.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'workspace' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    Select Workspace (Demo)
                  </div>
                  {DEMO_WORKSPACES.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        setSelectedWorkspace(ws.id);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex flex-col ${
                        selectedWorkspace === ws.id
                          ? 'bg-amber-500/20 text-amber-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{ws.name}</span>
                      <span className="text-[10px] text-slate-400">{ws.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Branch Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('branch')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 focus-ring"
              >
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[120px] truncate">
                  {DEMO_BRANCHES.find((b) => b.id === selectedBranch)?.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'branch' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    Select Git Branch
                  </div>
                  {DEMO_BRANCHES.map((br) => (
                    <button
                      key={br.id}
                      type="button"
                      onClick={() => {
                        setSelectedBranch(br.id);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedBranch === br.id
                          ? 'bg-blue-500/20 text-blue-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>{br.name}</div>
                      <div className="text-[10px] text-slate-400">{br.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Agent Selector Placeholder */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('agent')}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 focus-ring"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[90px] truncate">
                  {DEMO_AGENTS.find((a) => a.id === selectedAgent)?.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'agent' && (
                <div className="absolute top-full left-0 mt-1 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
                    Agent Engine
                    <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                      DEMO
                    </span>
                  </div>
                  {DEMO_AGENTS.map((ag) => (
                    <button
                      key={ag.id}
                      type="button"
                      onClick={() => {
                        setSelectedAgent(ag.id);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedAgent === ag.id
                          ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{ag.name}</span>
                      <p className="text-[10px] text-slate-400">{ag.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Model Selector Placeholder */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('model')}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 focus-ring"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span className="max-w-[100px] truncate">
                  {DEMO_MODELS.find((m) => m.id === selectedModel)?.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {activeDropdown === 'model' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
                    Model Selection
                    <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">
                      DEMO
                    </span>
                  </div>
                  {DEMO_MODELS.map((md) => (
                    <button
                      key={md.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(md.id);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedModel === md.id
                          ? 'bg-purple-500/20 text-purple-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{md.name}</span>
                        {md.badge && (
                          <span className="text-[9px] px-1 bg-purple-500/30 text-purple-300 rounded font-mono">
                            {md.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{md.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Section: Main Route Navigation */}
        <div className="flex items-center">
          <PrimaryNavigation />
        </div>

        {/* Right Section: Connection, Theme, Panel Controls */}
        <div className="flex items-center gap-2">
          {/* Connection Status Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono"
            title="Gateway server connection pending Phase 2"
          >
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden xl:inline">Offline (Gateway Disconnected)</span>
            <span className="xl:hidden">Offline</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={handleAppearanceCycle}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-ring"
            aria-label={`Toggle theme (Current: ${appearance})`}
            title={`Current theme: ${appearance}. Click to switch.`}
          >
            {appearance === 'dark' && <Moon className="w-4 h-4 text-purple-400" />}
            {appearance === 'light' && <Sun className="w-4 h-4 text-amber-400" />}
            {appearance === 'system' && <Laptop className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Right Panel Desktop Toggle */}
          <button
            onClick={toggleRightPanel}
            type="button"
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors focus-ring"
            aria-label={rightPanelOpen ? 'Collapse context panel' : 'Expand context panel'}
            title={rightPanelOpen ? 'Collapse context panel' : 'Expand context panel'}
          >
            {rightPanelOpen ? (
              <PanelRightClose className="w-4 h-4 text-amber-500" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Right Context Drawer Trigger */}
          <button
            onClick={() => setMobileContextOpen(true)}
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus-ring"
            aria-label="Open context drawer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
