// import app from "./app";

// app.listen(app.get("port"));

// console.log("Server on port", app.get("port"));
import app from "./app";
import "./database";
import { APP_PORT } from "./config";
(async () => {
  // const server = await app(store);

  app.listen(APP_PORT, () => console.log(`http://localhost:${APP_PORT}`));
})();
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
