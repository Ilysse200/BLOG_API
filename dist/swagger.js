"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Blog API and UserManagement API',
        description: 'Blog API is a system that allows different users to log in and navigate through the blog platform. Users are authenticated and their access is controlled to ensure the blog services is delivered appropriatelty.'
    },
    host: `localhost:${process.env.PORT || 8080}`,
    basePath: '/',
    schemes: ['http', 'https'],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['src/routes/index.ts'];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
