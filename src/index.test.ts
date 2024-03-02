import { describe, expect, it } from "vitest";
import { run } from ".";

describe("run", () => {
  it('should log "init :rocket"', () => {
    run();
  });
});
