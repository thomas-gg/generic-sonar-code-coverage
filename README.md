## Background

This npm module is made as a work-around for jest/vitest users who need [SonarQube Generic Test Coverage format](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/test-coverage/generic-test-data/#generic-test-coverage). There are other npm projects supporting [SonarQube Gerneric Test Execution Report Format](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/test-coverage/generic-test-data/#generic-test-execution). 

One use-case for this module is creating code coverage for svelte projects in SonarQube. SonarQube reports .svelte files as HTML files and does not show code coverage in their UI, even though svelte files can have code coverage with lcov. 

This module allows your test runner to create the "Generic Test Coverage" format that is associated with `sonar.coverageReportPaths`. You can combine the lcov output created via your test runner with the generic code coverage format when sending reports to SonarQube.

Do not use this module if your project is using only javascript/typescript! Use `sonar.javascript.lcov.reportPaths=coverage/lcov.info` as described in the documentation. The lcov option in your test runner is all you need, as it's optimized for sonar, again this module should only be used for projects that have files unsupported by SonarQube. Look into sonar community docs before using this module.

## Installation & Setup

```bash
npm install --save-dev sonar-generic-code-coverage
```

Example vitest config

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
      coverage: {
        exclude: [...configDefaults.exclude],
        reporter: ["json", "lcov", "cobertura", ["sonar-generic-code-coverage", { file: 'sonar-generic-coverage.xml'}]], // <path>/dist/index.js locally
      },
      reporters: ["default", "vitest-sonar-reporter"],
      outputFile: {
        "vitest-sonar-reporter": "coverage/sonar-report.xml",
      },
    },
});
```

You can also see an example for jest setup in the [example-jest folder](example-jest)

Noteworthy: in order to directly compare the resulting sonar-coverage.xml file in both directories, the vitest config should be set to istanbul rather than v8 to match the deafult jest config. Of course, if you use vitest you can still use v8 coverage for your own projects.

## Highlights:

This implementation is similar to the work of [node-sonar-coverage-reporter](https://github.com/Byndyusoft/node-sonar-coverage-reporter/tree/master); however, the `node-sonar-coverage-reporter` does not create an xml file that can be used as generic test data for SonarQube. This is a different implementation to the [cobertura istanbul reporter](https://github.com/istanbuljs/istanbuljs/blob/main/packages/istanbul-reports/lib/cobertura/index.js).

There are other [jest-sonar](https://www.npmjs.com/search?q=jest-sonar) projects on npm that may support your use-case, but they usually have to do with creating generic test execution report format.

If you prefer to have a post-process way of converting your test-runner reports into SonarQube generic test data, it may be worth looking into this [coverage-report-cobertura-to-sonar-generic](https://github.com/softreigns/coverage-report-cobertura-to-sonar-generic/blob/main/cobertura-sonar-generic.xslt) project that defines an xslt which can be used to convert cobertura to sonar generic test data format.

Another consideration to look into for the post-process way is to convert [lcov to sonar generic test data](https://www.npmjs.com/package/lcov-to-sonar-generic).

## Sonar

Assuming you have both vitest-sonar-reporter and sonar-generic-code-coverage, your sonar config may look like this:

```bash
sonar.testExecutionReportPaths=coverage/sonar-report.xml
# sonar.javascript.lcov.reportPaths=coverage/lcov.info     # include if javascript/typescript project
sonar.coverageReportPaths=coverage/sonar-coverage.xml
```