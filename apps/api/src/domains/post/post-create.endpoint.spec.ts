import { useTestEnvironment } from '../../../tests/test-environment';
import { PostCreateEndpoint } from './post-create.endpoint';
import { PostFixtures } from './post.fixtures';

describe(PostCreateEndpoint.name, () => {
  const { createTestCaller, createTestContext, testUsers, prisma } =
    useTestEnvironment();

  const postFixtures = new PostFixtures(prisma);

  it('should successfully create post', async () => {
    // arrange
    const createdPost = await postFixtures.create({});

    const ctx = createTestContext({});
    const testCaller = createTestCaller(ctx);

    // act
    const input = {};
    const result = await testCaller.post.create(input);

    // assert
    expect(result.result).toBe('success');

    if (result.result === 'success') {
      expect(result.data).toEqual({
        ...createdPost,
      });
    }
  });
});
