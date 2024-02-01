import express from "express";
import Fastify from "fastify";
import appServer from "./appServer";

const app = express();
const fastify = Fastify();

appServer(app, fastify, "favicon");
