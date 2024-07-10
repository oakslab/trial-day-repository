const path = require('path');
const fs = require('fs');
const github = require('@actions/github');

const main = async () => {
  const basePath = path.join(__dirname, '../');

  const { markdownTable } = await import('markdown-table');

  function getDirectories(source) {
    return fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  function getCoverageSummaryPaths(basePath) {
    const appsPath = path.join(basePath, 'apps');
    const packagesPath = path.join(basePath, 'packages');
    const packagesBasePath = path.join(basePath, 'packages', 'base');

    const getPaths = (sourcePath) =>
      getDirectories(sourcePath).reduce((acc, name) => {
        acc[name] = path.join(
          sourcePath,
          name,
          'coverage',
          'coverage-summary.json',
        );
        return acc;
      }, {});

    return {
      ...getPaths(appsPath),
      ...getPaths(packagesPath),
      ...getPaths(packagesBasePath),
    };
  }

  function readCoverageSummaries(paths) {
    return Object.keys(paths).reduce(
      (acc, key) => {
        const reportPath = paths[key];
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf8')).total;
          Object.entries(report).forEach(([metric, data]) => {
            if (!acc.total[metric])
              acc.total[metric] = { total: 0, covered: 0, skipped: 0 };
            acc.total[metric].total += data.total;
            acc.total[metric].covered += data.covered;
            acc.total[metric].skipped += data.skipped;
            acc.total[metric].pct = (
              (acc.total[metric].covered / acc.total[metric].total) *
              100
            ).toFixed(2);
          });
          acc[key] = report;
        }
        return acc;
      },
      { total: {} },
    );
  }

  function readCoverageFileStats(paths) {
    return Object.keys(paths).reduce((acc, key) => {
      const reportPath = paths[key];
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        Object.entries(report).forEach(([file, data]) => {
          if (file === 'total') return;
          Object.entries(data).forEach(([metric, value]) => {
            if (!acc[key]) acc[key] = {};
            if (!acc[key][file]) acc[key][file] = {};
            if (!acc[key][file][metric])
              acc[key][file][metric] = { total: 0, covered: 0 };
            acc[key][file][metric].total += value.total;
            acc[key][file][metric].covered += value.covered;
            acc[key][file][metric].pct = (
              (acc[key][file].covered / acc[key][file].total) *
              100
            ).toFixed(2);
          });
        });
        acc[key] = report;
      }
      return acc;
    }, {});
  }

  function formatCoverageForVisual(coverageSummariesReport) {
    // Include total coverage
    let formatted = {
      total: {
        lines: Number(coverageSummariesReport.total.lines.pct),
        statements: Number(coverageSummariesReport.total.statements.pct),
        functions: Number(coverageSummariesReport.total.functions.pct),
        branches: Number(coverageSummariesReport.total.branches.pct),
      },
    };

    formatted = {
      ...formatted,
      ...Object.entries(coverageSummariesReport).reduce(
        (acc, [key, report]) => {
          if (key !== 'total') {
            acc[key] = {
              lines: report.lines.pct,
              statements: report.statements.pct,
              functions: report.functions.pct,
              branches: report.branches.pct,
            };
          }
          return acc;
        },
        {},
      ),
    };

    return formatted;
  }

  function formatCoverageForFiles(coverageFileStats) {
    return Object.entries(coverageFileStats).reduce(
      (acc, [package, report]) => {
        acc[package] = Object.entries(report).map(([file, data]) => {
          if (file === 'total') return acc;
          return {
            file: path.relative(basePath, file),
            lines: data.lines.pct,
            statements: data.statements.pct,
            functions: data.functions.pct,
            branches: data.branches.pct,
          };
        });
        return acc;
      },
      {},
    );
  }

  const summaryPaths = getCoverageSummaryPaths(basePath);
  const coverageSummariesReport = readCoverageSummaries(summaryPaths);
  const coverageFileStats = readCoverageFileStats(summaryPaths);
  const visualSummariesCoverageReport = formatCoverageForVisual(
    coverageSummariesReport,
  );
  const visualFileStatsCoverageReport =
    formatCoverageForFiles(coverageFileStats);

  console.table(visualSummariesCoverageReport);

  const filesStatsString = Object.entries(visualFileStatsCoverageReport).reduce(
    (acc, [key, value]) => {
      acc = `${acc}**${key}**\n`;
      for (const file of value) {
        if (!file?.file) continue;
        let string = `- **${file.file}:** `;
        const delimiter = ' | ';
        for (const [metric, data] of Object.entries(file)) {
          if (metric === 'file' || !metric) continue;
          string = string + `${metric}: ${data}%${delimiter}`;
        }
        acc = acc + string.slice(0, -delimiter.length) + '\n';
      }
      return acc;
    },
    '',
  );

  const args = process.argv.slice(2);
  const githubToken = args[0];

  if (githubToken) {
    const octokit = github.getOctokit(githubToken);

    const markdownFormattedTable = markdownTable([
      ['Package', 'Lines', 'Statements', 'Functions', 'Branches'],
      ...Object.entries(visualSummariesCoverageReport).map(
        ([name, metrics]) => [
          `**${name}**`,
          `${metrics.lines}%`,
          `${metrics.statements}%`,
          `${metrics.functions}%`,
          `${metrics.branches}%`,
        ],
      ),
    ]);

    const markdown = `
## Coverage Report

${markdownFormattedTable}

<details>
  <summary>Files</summary>

  ${filesStatsString}
</details>
`;

    await octokit.rest.issues.createComment({
      issue_number: github.context.issue.number,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      body: markdown,
      headers: {
        accept: 'application/vnd.github.raw+json',
      },
    });
  }
};

main();
