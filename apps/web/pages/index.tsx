import {
  PermissionGuard,
  useAuth,
  usePermission,
} from '@base/auth-frontend-base';
import Head from 'next/head';
import { useState } from 'react';

import { trpc } from '@base/frontend-utils-base';
import { Alert, Button, Grid, Stack, Typography } from '@base/ui-base/ui';
import { Add } from '@base/ui-base/icons';

import { MainLayout } from '../components/layout/main-layout';
import { AddPostModal } from '../components/post/add-post-modal';
import { SinglePost } from '../components/post/single-post';

function PageIndex() {
  const { userProfile, user } = useAuth();
  const hasPermissionForUser = usePermission(['user.*', 'auditLog.*']);
  const [openPost, setOpenPost] = useState(false);

  const { data, isInitialLoading } = trpc.post.list.useQuery({
    pageSize: 10,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const togglePostModal = () => {
    setOpenPost((prev) => !prev);
  };

  console.log({ data, isInitialLoading });

  return (
    <MainLayout>
      <Head>
        <title>Welcome...</title>
        <meta
          name="viewport"
          content="width=device-width, viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Stack spacing={4} marginLeft={3} marginRight={3}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Posts</Typography>
          <Button variant="contained" color="inherit" onClick={togglePostModal}>
            Add post
          </Button>
        </Grid>
        {data?.data.items.map((post) => (
          <SinglePost post={post} key={post.id} />
        ))}
      </Stack>
      <AddPostModal open={openPost} onClose={togglePostModal} />
    </MainLayout>
  );
}

export default PageIndex;
