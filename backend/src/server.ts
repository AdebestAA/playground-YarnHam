import app from "./app";

const port = process.env.PORT || 8000;
const startServer = async () => {
  app.listen(port, () => {
    console.log("port is running at " + port);
  });
};

startServer();
