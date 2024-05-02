import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,ts}"],
    coverage: {
      exclude: [...configDefaults.exclude],
      reporter: [
        "lcov",
        "cobertura",
        ["../../../dist/index.js", { file: 'sonar-generic-report.xml' }],
      ],
      provider: "istanbul", // or v8
    },
    reporters: ["default", "vitest-sonar-reporter"],
    outputFile: {
      "vitest-sonar-reporter": "coverage/sonar-report.xml",
    },
  },
});
