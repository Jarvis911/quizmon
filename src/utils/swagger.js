import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Quiz API",
    description: "API documentation for Quiz App",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../server.js"]; // add route files

swaggerAutogen()(outputFile, endpointsFiles, doc);
