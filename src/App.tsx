import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { BuilderPage } from './pages/BuilderPage';
import { LivePreviewEmptyState } from './pages/LivePreviewEmptyState';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/builder" replace />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/live-preview" element={<LivePreviewEmptyState />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
