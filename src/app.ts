import express, { Application, Request, Response } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandler from "./errors/errorHandler";
import { responseHandler } from "./common/response-handler.common";
import { AllRouters } from "./routes";
import { ApiError } from "./errors/ApiError";
import path from "path";
import { setLocals } from "./helpers/locals-setter";
import { ROLES, ROUTES } from "./helpers/constants";
import { checkAuth } from "./modules/auth/auth.middleware";

const app: Application = express();

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.set("trust proxy", 1); // trust first proxy

// application middleware
app.use("/static", express.static("public"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(responseHandler);
app.use(setLocals);
app.use(AllRouters);

app.get('/health', (req: Request, res: Response) => {



  const used: any = process.memoryUsage();
  let text = '';
  for (let key in used) {
    text += `<h1>Memory: ${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB</h1>`;
  }

  return res.send(text);
})

app.get("/", (req: Request, res: Response) => {
  return res.redirect("/v1/");
});
app.get(ROUTES.root.path, (req: Request, res: Response) => {
  return res.render(ROUTES.root.location, {
    title: "Journal",
  });
});

app.get("/v1/article-details", (req: Request, res: Response) => {
  return res.render("article-details", {
    title: "Journal",
  });
});

app.get("/v1/authors-information", (req: Request, res: Response) => {
  return res.render("authors-information", {
    title: "Journal",
  });
});

app.get("/v1/blog", (req: Request, res: Response) => {
  return res.render("blog", {
    title: "Journal",
  });
});

app.get("/v1/contact", (req: Request, res: Response) => {
  return res.render("contact", {
    title: "Journal",
  });
});

app.get("/v1/contact-journal", (req: Request, res: Response) => {
  return res.render("contact-journal", {
    title: "Journal",
  });
});

app.get("/v1/current-issue", (req: Request, res: Response) => {
  return res.render("current-issue", {
    title: "Journal JKKNIU",
  });
});

app.get("/v1/volume-issue", (req: Request, res: Response) => {
  return res.render("volume-issue", {
    title: "Journal",
  });
});

app.get("/v1/editorial-board", (req: Request, res: Response) => {
  return res.render("editorial-board", {
    title: "Journal",
  });
});

app.get("/v1/information", (req: Request, res: Response) => {
  return res.render("information", {
    title: "Journal",
  });
});

app.get("/v1/news", (req: Request, res: Response) => {
  return res.render("news", {
    title: "Journal",
  });
});

app.get("/v1/news-details", (req: Request, res: Response) => {
  return res.render("news-details", {
    title: "Journal",
  });
});

app.get("/v1/registration", (req: Request, res: Response) => {
  return res.render("registration", {
    title: "Journal",
  });
});

app.all("/v1/*", (req: Request, res: Response) => {
  return res.render("404", {
    error: "Page not found",
  });
});

app.use(ErrorHandler.errorHandler);

export default app;
