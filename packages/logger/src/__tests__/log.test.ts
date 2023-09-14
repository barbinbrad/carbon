import Logger from "..";

jest.spyOn(global.console, "log");
jest.spyOn(global.console, "info");
jest.spyOn(global.console, "trace");
jest.spyOn(global.console, "warn");
jest.spyOn(global.console, "error");

describe("logger", () => {
  const logger = Logger.create("test");
  it("calls console info", () => {
    logger.info("hello");
    expect(console.info).toBeCalled();
  });
  it("calls console trace", () => {
    logger.trace("hello");
    expect(console.trace).toBeCalled();
  });
  it("calls console warn", () => {
    logger.warn("hello");
    expect(console.warn).toBeCalled();
  });
  it("calls console error", () => {
    logger.error("hello");
    expect(console.error).toBeCalled();
  });
});
