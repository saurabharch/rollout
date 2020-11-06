const Helper = require("./helper");
const helper = new Helper();
const urlPrefix = "/v1/auth";

describe("Forgot password endpoints", () => {
  it("Consuming API endpoint", async () => {
    const {
      body
    } = await helper.apiServer.post(`${urlPrefix}/reset/password/email`, {
      email: "saurabh@raindigi.com"
    });
    expect(body).toHaveProperty("x-access-token");
    expect(body).toHaveProperty("email");
  });
});
