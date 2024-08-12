import { test, expect } from "vitest";
import { nearestStartOfWeek } from "./helper";

test("Test nearestStartOfWeek after week start", () => {
    expect(nearestStartOfWeek("2024-08-08", 3)).toBe("2024-08-07");   
})

test("Test nearestStartOfWeek before week start", () => {
    expect(nearestStartOfWeek("2024-08-06", 3)).toBe("2024-07-31");   
})

