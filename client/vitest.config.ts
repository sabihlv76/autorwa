import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    testTimeout: 20000,
    // Generous: mongodb-memory-server's beforeAll may need to download its
    // MongoDB binary the first time it runs.
    hookTimeout: 180000,
    // Each integration test file starts its own mongod instance; running
    // multiple files in parallel worker forks starves them of CPU/IO and
    // some fail to start within the launch timeout. Sequential is slower
    // but reliable.
    fileParallelism: false,
  },
});
