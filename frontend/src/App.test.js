import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main app structure', () => {
  render(<App />);
  // Check for text that exists in the initial Home or structure, e.g., from Home.js
  const homeElement = screen.getByText(/Start Customizing Your Website/i);
  expect(homeElement).toBeInTheDocument();
});
