import { app, HttpResponseInit } from "@azure/functions";

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async (): Promise<HttpResponseInit> => {
    return {
      status: 200,
      jsonBody: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "0.1.0",
      },
    };
  },
});
