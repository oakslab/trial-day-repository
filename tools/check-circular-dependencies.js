const { parseCircular, parseDependencyTree, prettyCircular } = require('dpdm');

const validateDependencyTree = async () => {
  try {
    const depsTree = await parseDependencyTree(
      [
        'apps/admin/pages',
        'apps/api/pages',
        'apps/examples/pages',
        'apps/mobile/pages',
        'apps/web/pages',
      ],
      {
        extensions: ['.ts', '.tsx', '.json'],
        exclude: /node_modules/,
      },
    );

    const circulars = parseCircular(depsTree);

    if (circulars.length) {
      console.log(
        `The following circular dependecies detected: ${prettyCircular(circulars)}`,
      );
      process.exit(1);
    } else {
      console.log(`No circular dependecies detected`);
      process.exit(0);
    }
  } catch (err) {
    console.error(err);
  }
};

validateDependencyTree();
