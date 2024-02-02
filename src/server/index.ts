import Fastify from "fastify";
import appServer from "./appServer";

const fastify = Fastify();

appServer(fastify, "favicon");
