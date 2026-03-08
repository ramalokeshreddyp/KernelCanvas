import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProcessForm } from '@/components/ProcessForm';

describe('ProcessForm', () => {
  it('shows validation error when add callback rejects', () => {
    const onAdd = vi.fn(() => ({ ok: false, error: 'Allocation failed: insufficient contiguous free memory for this process.' }));

    render(<ProcessForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText('MEMORY (KB)'), { target: { value: '9000' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalled();
    expect(screen.getByText(/allocation failed/i)).toBeInTheDocument();
  });

  it('submits valid process details', () => {
    const onAdd = vi.fn(() => ({ ok: true }));

    render(<ProcessForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText('NAME'), { target: { value: 'Editor' } });
    fireEvent.change(screen.getByLabelText('ARRIVAL'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('BURST'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('PRIORITY'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('MEMORY (KB)'), { target: { value: '128' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith({
      name: 'Editor',
      arrivalTime: 1,
      burstTime: 3,
      priority: 2,
      memoryRequired: 128,
    });
  });
});
