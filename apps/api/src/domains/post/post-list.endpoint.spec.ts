import { PostListOutputType } from 'common';
import { useTestEnvironment } from '../../../tests/test-environment';
import { PostListEndpoint } from './post-list.endpoint';
import { PostFixtures } from './post.fixtures';

describe(PostListEndpoint.name, () => {
  const { createTestCaller, createTestContext, testUsers, prisma } =
    useTestEnvironment();

  const postFixtures = new PostFixtures(prisma);

  it('should successfully list all posts', async () => {
    // arrange
    const pageSize = 10;
    await postFixtures.createMany(pageSize * 2 + 5);
    const ctx = createTestContext({});
    const testCaller = createTestCaller(ctx);

    let page = 0;
    let allPosts: PostListOutputType['items'] = [];
    let fetchedPosts: PostListOutputType['items'];

    // act
    do {
      const result = await testCaller.post.list({
        filters: {},
        pageSize,
        page,
      });

      expect(allPosts).not.toEqual(null);

      fetchedPosts = result.data?.items ?? [];
      allPosts = allPosts.concat(result.data?.items ?? []);
      page++;
    } while (fetchedPosts.length === pageSize);

    // assert
    const expectedPosts = await prisma.post.findMany({});

    expect(allPosts).toHaveLength(expectedPosts.length);

    expectedPosts.forEach((rec) => {
      expect(allPosts).toContainEqual(
        expect.objectContaining({
          id: rec.id,
          // Please expand assertion:
          // email: rec.email,
          // organization: rec.organization
        }),
      );
    });
  });
});
