// Dependency-Cruiser configuration
// Docs: https://github.com/sverweij/dependency-cruiser

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    tsConfig: {
      fileName: './tsconfig.json'
    },
    tsPreCompilationDeps: true,
    doNotFollow: {
      path: 'node_modules|\.next|dist|build|coverage'
    },
    exclude: {
      path: ['node_modules', '.next', 'dist', 'build', 'coverage']
    },
    // Collapse modules by folder to simplify the graph. Accepts a regex string.
    // Example: collapse common top-level app folders
    collapse: '^(components|pages|src)(/|$)',
    combinedDependencies: true,
    reporterOptions: {
      dot: {
        theme: {
          graph: { rankdir: 'LR' }
        }
      }
    }
  },
  forbidden: [
    // Example rule: prevent cycles
    {
      name: 'no-cycles',
      severity: 'warn',
      from: {},
      to: { circular: true }
    }
  ]
};
