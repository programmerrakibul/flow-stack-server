import cors from "cors";
import express from "express";

import { getEnv, NODE_ENV } from "@/config/env";
import mountedRoutes from "./mounted-routes";

const app = express();
const env = getEnv();
const PORT = env.PORT;

app.use(express.json());
app.use(cors());

mountedRoutes(app);

app.listen(PORT, () => {
  if (env.NODE_ENV !== NODE_ENV.PRODUCTION)
    console.log(`Server listening on port: ${PORT}`);
});
