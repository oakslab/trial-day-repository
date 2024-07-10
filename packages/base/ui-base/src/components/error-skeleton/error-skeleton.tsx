import { Button, Typography, Box, Stack, useTheme } from '@mui/material';
import { useRouter } from '../../hooks';
import Iconify from '../iconify';
import { ErrorObj } from './types';
import { getDefaultSubtitle, getDefaultTitle, showStatusCode } from './utils';

type Props = {
  error: ErrorObj;
  resetErrorBoundary: (...args: unknown[]) => void;
  statusCode?: number;
  title?: string;
  subTitle?: string;
};

export default function ErrorSkeleton({
  error,
  resetErrorBoundary,
  statusCode = error?.data?.httpStatus,
  title = getDefaultTitle(error),
  subTitle = getDefaultSubtitle(error),
}: Props) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        height={'100%'}
        py={4}
      >
        <Iconify
          icon={'material-symbols:error-outline'}
          width={48}
          sx={{
            color: theme.palette.error.main,
          }}
        />
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" textAlign="center">
          {subTitle}. {'Please try again later.'}
          <br />
          If the error persist, please contact our support.
        </Typography>
        {showStatusCode(error) && (
          <Typography variant="body2">HTTP ERROR {statusCode}</Typography>
        )}
        <Stack direction="column" alignItems="center" my={1} gap={1}>
          {(statusCode === 403 || statusCode === 404) && (
            <Button
              fullWidth={false}
              variant="soft"
              onClick={() => router.replace('/')}
            >
              Back Home
            </Button>
          )}
          <Button variant="contained" onClick={resetErrorBoundary}>
            Refresh
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
