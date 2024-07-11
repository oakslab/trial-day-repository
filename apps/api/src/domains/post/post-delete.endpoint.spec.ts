import { useTestEnvironment } from '../../../tests/test-environment';
import { PostDeleteEndpoint } from './post-delete.endpoint';
import { PostFixtures } from './post.fixtures';

describe(PostDeleteEndpoint.name, () => {
  const { createTestCaller, createTestContext, testUsers, prisma } =
    useTestEnvironment();

  const postFixtures = new PostFixtures(prisma);

  it('should successfully delete post', async () => {
    // arrange
    const createdPost = await postFixtures.create({});

    const ctx = createTestContext({});
    const testCaller = createTestCaller(ctx);

    // act
    const input = { id: createdPost.id };
    const result = await testCaller.post.delete(input);

    // assert
    expect(result.result).toBe('success');
  });
});
