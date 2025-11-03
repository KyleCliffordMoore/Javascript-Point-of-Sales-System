/**
 * Test to verify the "learn react" link is rendered in the App component.
 * It checks if the text "learn react" appears in the document.
 */
import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Test to verify the "learn react" link is rendered in the App component.
 * It checks if the text "learn react" appears in the document.
 */
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
