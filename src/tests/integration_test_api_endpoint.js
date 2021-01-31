const Helper = require("./helper");
const helper = new Helper();
const urlPrefix = "/v1/auth";

describe("Forgot password endpoints", () => {
  it("Consuming API endpoint", async () => {
    const {
      body
    } = await helper.apiServer.post(`${urlPrefix}/forgot-password`, {
      email: "email@mailinator.com"
    });
    expect(body).toHaveProperty("reset_token");
    expect(body).toHaveProperty("email");
  });
});
