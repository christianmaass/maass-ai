/* Madge configuration to work with TS path aliases and reduce false positives */
/** @type {import('madge').MadgeConfig} */
module.exports = {
  tsConfig: './tsconfig.json',
  fileExtensions: ['ts', 'tsx'],
  // Exclude noisy or entry-only paths from orphan checks and graphs
  excludeRegExp: [
    // Next.js API routes are router entry points
    '^pages/api/',
    // Marketing pages wrapped under pages/ as entry points
    '^src/\\(marketing\\)/pages/',
    // Layout entry points and index barrels
    '^src/layout/',
    '/index\\.ts$',
    // Misc non-source or generated
    '^dev/',
    '^archive/',
    '^docs/',
    '^scripts/'
  ],
  detectiveOptions: {
    es6: { mixedImports: true }
  }
};
