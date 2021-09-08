import server from "./server.js";
import mongoose from "mongoose";

const port = process.env.PORT || 3004

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() =>
    server.listen(port, () => {
      console.log("🧡 server is running on port ", port);
    })
  )
  .catch((err) => console.log(err));