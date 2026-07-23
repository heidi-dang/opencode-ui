import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button, Badge, Panel, Tabs, StateBlock, KeyShortcut, SectionHeader, SegmentedControl } from '../components/ui';
import { SESSION_STATUS_VISUALS } from '../contracts/presentation';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.firstChild).toHaveClass('bg-amber-500');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    expect(container.firstChild).toHaveClass('px-4');
  });
});

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('bg-emerald-500/10');
  });

  it('defaults to default variant', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-slate-800');
  });
});

describe('Panel', () => {
  it('renders title and children', () => {
    render(
      <Panel title="Test Panel">
        <p>Content</p>
      </Panel>
    );
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders badge in header', () => {
    render(
      <Panel title="Panel" badge={<span>Badge</span>}>
        <p>Content</p>
      </Panel>
    );
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Panel title="Panel" footer="Footer text">
        <p>Content</p>
      </Panel>
    );
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('applies bodyClassName to the body area', () => {
    const { container } = render(
      <Panel title="Panel" bodyClassName="p-3">
        <p>Content</p>
      </Panel>
    );
    const bodyArea = container.querySelector('.flex-1.overflow-y-auto');
    expect(bodyArea).toHaveClass('p-3');
  });
});

describe('Tabs', () => {
  const items = [
    { id: 'tab1', label: 'Tab One' },
    { id: 'tab2', label: 'Tab Two' },
  ];

  it('renders tab items', () => {
    render(<Tabs items={items} activeId="tab1" onChange={() => {}} />);
    expect(screen.getByText('Tab One')).toBeInTheDocument();
    expect(screen.getByText('Tab Two')).toBeInTheDocument();
  });

  it('has tablist role', () => {
    render(<Tabs items={items} activeId="tab1" onChange={() => {}} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('marks active tab as selected', () => {
    render(<Tabs items={items} activeId="tab1" onChange={() => {}} />);
    const tab = screen.getByRole('tab', { name: /Tab One/i });
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange when inactive tab is clicked', async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeId="tab1" onChange={onChange} />);
    await userEvent.click(screen.getByText('Tab Two'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });
});

describe('StateBlock', () => {
  it('renders label from visual data', () => {
    render(<StateBlock visual={SESSION_STATUS_VISUALS.idle} />);
    expect(screen.getByText('Idle')).toBeInTheDocument();
  });

  it('renders dot-only variant without label', () => {
    const { container } = render(<StateBlock visual={SESSION_STATUS_VISUALS.busy} dotOnly />);
    expect(container.firstChild).toHaveClass('w-1.5');
    expect(screen.queryByText('Busy')).not.toBeInTheDocument();
  });

  it('renders detail text when provided', () => {
    render(<StateBlock visual={SESSION_STATUS_VISUALS.error} detail="Something went wrong" />);
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('sets aria-label on dot-only variant', () => {
    const { container } = render(<StateBlock visual={SESSION_STATUS_VISUALS.idle} dotOnly />);
    expect(container.firstChild).toHaveAttribute('aria-label', 'Idle');
  });
});

describe('KeyShortcut', () => {
  it('renders key labels', () => {
    render(<KeyShortcut keys={['Ctrl', 'K']} />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });
});

describe('SectionHeader', () => {
  it('renders title', () => {
    render(<SectionHeader title="My Section" />);
    expect(screen.getByText('My Section')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<SectionHeader title="Section" subtitle="Details" />);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders action element', () => {
    render(<SectionHeader title="Section" action={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

describe('SegmentedControl', () => {
  const options = [
    { id: 'opt1', label: 'Option 1' },
    { id: 'opt2', label: 'Option 2' },
  ];

  it('renders options', () => {
    render(<SegmentedControl options={options} value="opt1" onChange={() => {}} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('has radiogroup role', () => {
    render(<SegmentedControl options={options} value="opt1" onChange={() => {}} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('calls onChange with option id', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl options={options} value="opt1" onChange={onChange} />);
    await userEvent.click(screen.getByText('Option 2'));
    expect(onChange).toHaveBeenCalledWith('opt2');
  });
});
