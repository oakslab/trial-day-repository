import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Login from '../pages/auth/login';

test('loads and displays greeting', async () => {
  // ARRANGE
  render(<Login />);

  // ASSERT
  expect(screen.getByLabelText('Email Address')).not.toBeUndefined();
});
