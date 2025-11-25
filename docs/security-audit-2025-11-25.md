# Security Audit Report (2025-11-25)

## Summary
- `npm audit --production` now reports **0 vulnerabilities** after upgrading SheetJS `xlsx` to a patched build.
- The previous prototype pollution and potential ReDoS advisories are remediated by consuming the vendor tarball release `0.20.3`.
- The dependency is pinned to the official SheetJS CDN (`https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz`) to receive patched community builds.

## Methodology
- Ran `npm audit --production` against the current lockfile to evaluate production dependencies.
- Reviewed the generated JSON report to validate severity and dependency impact.

## Findings
### High (Resolved): Prototype Pollution and ReDoS in `xlsx`
- Previously detected in the direct dependency `xlsx@0.18.5` referenced by the project.
- Advisories: [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6) (Prototype Pollution) and [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9) (ReDoS).
- Affected ranges: `<0.19.3` (prototype pollution) and `<0.20.2` (ReDoS).
- **Remediation:** Upgrade to the SheetJS CDN tarball `xlsx@0.20.3` (configured in `package.json`), which includes the upstream patches.

## Recommendations
- Keep `xlsx` pinned to the SheetJS CDN (`https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz`) to receive patched builds beyond what is published on npm.
- Validate export/import flows and workbook parsing logic after dependency updates.
- Re-run `npm audit --production` after pulling dependencies to verify the vulnerability remains cleared.
