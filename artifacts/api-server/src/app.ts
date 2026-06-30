import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", router);

// Global error handler — ensures body-parser failures (e.g. 413 Entity Too Large)
// and any other Express errors always return a JSON response for /api routes.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number; type?: string }, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as { status?: number }).status ?? 500;
  const message =
    err.type === "entity.too.large"
      ? "File terlalu besar. Maksimum ukuran upload adalah 25MB."
      : (err.message ?? "Terjadi kesalahan pada server.");
  logger.error({ err }, "Unhandled express error");
  res.status(status).json({ error: message });
});

export default app;
