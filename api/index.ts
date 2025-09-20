import { MyRouter } from "./routes/MyRouter";
import { Server } from "./Server";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    const myRouter = new MyRouter();
    const server = new Server(myRouter, 8900);
    server.start();
  })
  .catch((error) => console.log("Error during Data Source initialization:", error));
