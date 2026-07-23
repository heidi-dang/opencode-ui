import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { useUiStore } from '../store/useUiStore';
import { QualityAssurancePage } from '../pages/QualityAssurancePage';

function renderApp(route = '/') {
  window.history.pushState({}, '', route);
  return render(<App />);
}

beforeEach(() => {
  useUiStore.setState({
    appearance: 'system',
    leftPanelOpen: true,
    rightPanelOpen: true,
    mobileNavigationOpen: false,
    mobileContextOpen: false,
    activeContextSection: 'workspace',
    commandPaletteOpen: false,
  });
  localStorage.clear();
});

describe('/qa route', () => {
  it('renders the QA page when navigating to /qa', async () => {
    renderApp('/qa');
    await waitFor(() => {
      expect(screen.getByText(/Frontend QA Sandbox/i)).toBeInTheDocument();
    });
  });

  it('shows the QA page label on /qa route', async () => {
    renderApp('/qa');
    await waitFor(() => {
      expect(screen.getByText(/Frontend QA Sandbox/i)).toBeInTheDocument();
    });
  });

  it('renders stress data section on QA page', async () => {
    renderApp('/qa');
    await waitFor(() => {
      const stressHeaders = screen.getAllByText(/STRESS TEST/i);
      expect(stressHeaders.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders UI State Gallery section', async () => {
    renderApp('/qa');
    await waitFor(() => {
      expect(screen.getByText(/UI State Gallery/i)).toBeInTheDocument();
    });
  });

  it('renders accessibility check section', async () => {
    renderApp('/qa');
    await waitFor(() => {
      expect(screen.getByText(/Accessibility Check/i)).toBeInTheDocument();
    });
  });
});

describe('QualityAssurancePage component', () => {
  it('renders the QA component directly', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText(/Frontend QA Sandbox/i)).toBeInTheDocument();
    // "Demo Only" appears in heading; use getAllByText since it appears in other contexts too
    const demoOnlyElements = screen.getAllByText(/Demo Only/i);
    expect(demoOnlyElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Button variants', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    // "Danger" appears multiple times (button + badge), so use getAllByText
    const dangerElements = screen.getAllByText('Danger');
    expect(dangerElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Ghost')).toBeInTheDocument();
  });

  it('shows Badge variants', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText('Success')).toBeInTheDocument();
    const warningElements = screen.getAllByText('Warning');
    expect(warningElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows stress test data', () => {
    render(<QualityAssurancePage />);
    const stressHeaders = screen.getAllByText(/STRESS TEST/i);
    expect(stressHeaders.length).toBeGreaterThanOrEqual(6);
  });

  it('shows empty, loading, error, and degraded states', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText('No items to display.')).toBeInTheDocument();
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('Connection degraded')).toBeInTheDocument();
  });

  it('has retry action buttons in error state', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText('Retry Connection')).toBeInTheDocument();
    expect(screen.getByText('Reconnect')).toBeInTheDocument();
  });

  it('has a reduced motion note', () => {
    render(<QualityAssurancePage />);
    const reducedMotionElements = screen.getAllByText(/prefers-reduced-motion/);
    expect(reducedMotionElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows typography samples', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText('Heading 1 — Page Title')).toBeInTheDocument();
    expect(screen.getByText('Heading 6 — Small Label')).toBeInTheDocument();
  });

  it('shows focus ring examples', () => {
    render(<QualityAssurancePage />);
    expect(screen.getByText(/Focusable Button/)).toBeInTheDocument();
    expect(screen.getByText(/Focusable link/)).toBeInTheDocument();
  });

  it('shows ARIA attributes list in accessibility check', () => {
    render(<QualityAssurancePage />);
    const ariaModalElements = screen.getAllByText(/aria-modal/);
    expect(ariaModalElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/aria-expanded/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/aria-current/).length).toBeGreaterThanOrEqual(1);
  });
});
