import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Login } from '../features/Auth/Login';

test('loads and displays greeting', async () => {
  // ARRANGE
  render(<Login expectedUserRoles={[]} />);

  // ASSERT
  expect(screen.getByLabelText('Email Address')).not.toBeUndefined();
});
