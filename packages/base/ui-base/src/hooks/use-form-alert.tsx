import { useState } from 'react';
import { Alert } from '@mui/material';

export function useFormAlert() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ErrorComponent = () => {
    if (!errorMsg) return null;

    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {errorMsg}
      </Alert>
    );
  };

  return {
    errorMsg,
    setErrorMsg,
    ErrorComponent,
  };
}
