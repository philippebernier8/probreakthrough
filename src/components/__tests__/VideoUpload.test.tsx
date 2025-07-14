import { render, screen, fireEvent } from '@testing-library/react';
import VideoUpload from '../VideoUpload';

describe('VideoUpload', () => {
  const mockOnVideoSubmit = jest.fn();

  beforeEach(() => {
    mockOnVideoSubmit.mockClear();
  });

  it('renders correctly', () => {
    render(<VideoUpload onVideoSubmit={mockOnVideoSubmit} />);
    expect(screen.getByLabelText(/youtube video url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('validates YouTube URL format', () => {
    render(<VideoUpload onVideoSubmit={mockOnVideoSubmit} />);
    const input = screen.getByLabelText(/youtube video url/i);
    const submitButton = screen.getByRole('button', { name: /save/i });

    // Invalid URL
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(/please enter a valid youtube url/i)).toBeInTheDocument();
    expect(mockOnVideoSubmit).not.toHaveBeenCalled();

    // Valid URL
    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=dQw4w9WgXcQ' } });
    fireEvent.click(submitButton);
    expect(mockOnVideoSubmit).toHaveBeenCalledWith('https://youtube.com/watch?v=dQw4w9WgXcQ');
  });

  it('shows error when URL is empty', () => {
    render(<VideoUpload onVideoSubmit={mockOnVideoSubmit} />);
    const submitButton = screen.getByRole('button', { name: /save/i });

    fireEvent.click(submitButton);
    expect(screen.getByText(/please enter a youtube url/i)).toBeInTheDocument();
    expect(mockOnVideoSubmit).not.toHaveBeenCalled();
  });
}); 