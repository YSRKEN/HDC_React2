import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('タイトルを表示できる', async () => {
    render(<App />);
    expect(await screen.findByText('艦娘大破率計算機(改)')).toBeInTheDocument();
  });
});
