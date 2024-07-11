import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@base/ui-base/ui';
import FavoriteIcon from '@mui/icons-material/Favorite';

type SinglePostProps = {
  post: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    userId: string | null;
  };
};

export const SinglePost = ({ post }: SinglePostProps) => (
  <Card>
    <CardContent>
      <Stack spacing={4}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          gap={2}
          alignItems="center"
        >
          <Avatar />
          <Typography variant="subtitle1">User</Typography>
        </Grid>{' '}
        <Typography variant="body1">{post.content}</Typography>
      </Stack>
    </CardContent>
    <CardActions>
      <IconButton>
        <FavoriteIcon />
      </IconButton>
    </CardActions>
  </Card>
);
