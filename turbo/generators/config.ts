// To learn more about the generator's API explore:
// https://turbo.build/repo/docs/core-concepts/monorepos/code-generation
import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setHelper('kebabCase', function (text) {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2') // split camelCase
      .replace(/[\s_]+/g, '-') // replace spaces and underscores with -
      .toLowerCase(); // convert to lower case
  });

  plop.setHelper('ifEquals', function (this: any, arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  plop.setGenerator('api-crud', {
    description:
      'Generate endpoints, types, spec, fixtures, router, repo for the API Domain',
    prompts: [
      {
        type: 'input',
        name: 'domain',
        message: 'What is the business domain you want to create?',
      },
      {
        type: 'list',
        name: 'entityIdType',
        message: 'What type of ID will be your entity using?',
        choices: ['cuid', 'integer'],
      },
    ],
    actions: [
      // Endpoints
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-create.endpoint.ts',
        templateFile: 'templates/endpoint/create.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-delete.endpoint.ts',
        templateFile: 'templates/endpoint/delete.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-list.endpoint.ts',
        templateFile: 'templates/endpoint/list.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-update.endpoint.ts',
        templateFile: 'templates/endpoint/update.hbs',
      },
      // Router, repo, fixtures
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}.repo.ts',
        templateFile: 'templates/repo/repo.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}.router.ts',
        templateFile: 'templates/domain/router.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}.fixtures.ts',
        templateFile: 'templates/fixtures/fixtures.hbs',
      },
      // Common types
      {
        type: 'add',
        path: 'packages/common/src/domain/{{camelCase domain}}/{{kebabCase domain}}-create.types.ts',
        templateFile: 'templates/type/create.hbs',
      },
      {
        type: 'add',
        path: 'packages/common/src/domain/{{camelCase domain}}/{{kebabCase domain}}-delete.types.ts',
        templateFile: 'templates/type/delete.hbs',
      },
      {
        type: 'add',
        path: 'packages/common/src/domain/{{camelCase domain}}/{{kebabCase domain}}-list.types.ts',
        templateFile: 'templates/type/list.hbs',
      },
      {
        type: 'add',
        path: 'packages/common/src/domain/{{camelCase domain}}/{{kebabCase domain}}-update.types.ts',
        templateFile: 'templates/type/update.hbs',
      },
      {
        type: 'add',
        path: 'packages/common/src/domain/{{camelCase domain}}/{{kebabCase domain}}.types.ts',
        templateFile: 'templates/type/schema.hbs',
      },
      {
        type: 'add',
        path: 'packages/common/src/domain/{{camelCase domain}}/index.ts',
        templateFile: 'templates/type/index.hbs',
      },
      {
        type: 'append',
        path: 'packages/common/src/domain/index.ts',
        template: `export * from './{{camelCase domain}}';`,
      },
      // Backend testing files
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-create.endpoint.spec.ts',
        templateFile: 'templates/test/create.spec.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-delete.endpoint.spec.ts',
        templateFile: 'templates/test/delete.spec.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-list.endpoint.spec.ts',
        templateFile: 'templates/test/list.spec.hbs',
      },
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}-update.endpoint.spec.ts',
        templateFile: 'templates/test/update.spec.hbs',
      },
      // Append application routers
      {
        type: 'modify',
        path: 'apps/api/src/app.ts',
        pattern: /(\/\/ turbo-generator:placeholder:app:imports)/g,
        template:
          "import { {{camelCase domain}}Router } from './domains/{{camelCase domain}}/{{kebabCase domain}}.router';\n$1",
      },
      {
        type: 'modify',
        path: 'apps/api/src/app.ts',
        pattern: /(\/\/ turbo-generator:placeholder:app:router)/g,
        template: '{{camelCase domain}}: {{camelCase domain}}Router,\n$1',
      },
      // Append prisma schema - we also can do with this generators
      // But we do not need now, for testing we use "model DummyForTest"
    ],
  });

  plop.setGenerator('api-repo', {
    description: 'Generate only repo for the API Domain',
    prompts: [
      {
        type: 'input',
        name: 'domain',
        message: 'For which domain do you want to create a repo?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/api/src/domains/{{camelCase domain}}/{{kebabCase domain}}.repo.ts',
        templateFile: 'templates/repo/repo.hbs',
      },
    ],
  });
}
