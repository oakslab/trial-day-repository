import omit from 'lodash/omit';
import { useTestEnvironment } from '../../../tests/test-environment';
import { PostCreateEndpoint } from './post-create.endpoint';
import { PostFixtures } from './post.fixtures';

describe(PostCreateEndpoint.name, () => {
  const { createTestCaller, createTestContext, testUsers, prisma } =
    useTestEnvironment();

  const postFixtures = new PostFixtures(prisma);

  it('should successfully update post', async () => {
    // arrange
    const postToUpdate = await postFixtures.create({});
    const updateData = omit(
      PostFixtures.of({
        // Please expand fields for update:
        // email: postToUpdate.email,
        // organization: postToUpdate.organization
      }),
      'someOtherField',
    );

    const ctx = createTestContext({});
    const testCaller = createTestCaller(ctx);

    // act
    const updatedPost = await testCaller.post.update({
      ...postToUpdate,
      ...updateData,
    });

    // assert
    expect(updatedPost.result).toEqual('success');
    if (updatedPost.result === 'success') {
      expect(omit(updatedPost.data, 'someOtherField')).toEqual({
        id: postToUpdate.id,
        ...updateData,
      });
    }
  });
});
