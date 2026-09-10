import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import Store from './store/redux/store';
import App from './App';

test('App renders without crashing', () => {
  render(
    <Provider store={Store}>
      <App />
    </Provider>
  );
  expect(screen.getByRole('main') || document.getElementById('root')).toBeInTheDocument();
});