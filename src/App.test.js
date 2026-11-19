import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the regions page without authentication', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Régions' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /nouvelle région/i })).toBeInTheDocument();
  expect(await screen.findByText('Aucune région trouvée.')).toBeInTheDocument();
});
