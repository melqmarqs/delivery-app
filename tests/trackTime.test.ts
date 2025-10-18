import { getFastestPath } from "../utils/helper";

const mockGraph = {
  A1: { A2: 10, B1: 15 },
  A2: { A1: 10, B2: 5 },
  B1: { A1: 15, B2: 20 },
  B2: { A2: 5, B1: 20 },
};

describe("getFastestPath", () => {
  it("should return the shortest path and route time", () => {
    const result = getFastestPath(mockGraph, "A1", "B2")!;

    expect(result.path).toEqual(expect.arrayContaining(["A1", "A2", "B2"]));
    expect(result.distance).toBeGreaterThan(0);
  });

  it("should handle invalid coordinates gracefully", () => {
    expect(() => getFastestPath(mockGraph, 'Z1', 'F3')).toThrow();
  });
});
