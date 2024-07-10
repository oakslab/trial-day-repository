module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce useMutation to be used only within specific folders',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedPaths: {
            type: 'array',
            items: {
              type: 'string',
            },
            minItems: 1, // Ensure the array has at least one item
          },
        },
        required: ['allowedPaths'], // Make allowedPaths required
        additionalProperties: false,
      },
    ], // options schema
    messages: {
      avoidDirectUse:
        'useMutation cannot be used directly. Please create a custom hook under one of the allowed folders and invoke it here.',
      noAllowedPathsProvided:
        'No allowedPaths option provided. Please specify the allowed paths in the rule configuration.',
    },
  },
  create(context) {
    if (context.options.length === 0 || !context.options[0].allowedPaths) {
      // If no options provided or allowedPaths is missing, report configuration error
      context.report({
        loc: { line: 1, column: 0 },
        messageId: 'noAllowedPathsProvided',
      });
      return {}; // Exit early
    }

    const allowedPaths = context.options[0].allowedPaths;

    return {
      CallExpression(node) {
        const isUseMutationCall =
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'useMutation';
        if (isUseMutationCall) {
          const filename = context.getFilename();
          const isAllowedPath = allowedPaths.some((path) =>
            filename.includes(path),
          );
          if (!isAllowedPath) {
            context.report({
              node,
              messageId: 'avoidDirectUse',
            });
          }
        }
      },
    };
  },
};
