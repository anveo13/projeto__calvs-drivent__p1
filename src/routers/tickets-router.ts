import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import {  createTicket, getTicketsType, showTickets } from "@/controllers";
import { ticketsSchema } from "@/schemas/tickets-schema";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/", showTickets)
  .get("//types", getTicketsType)
  .post("/", validateBody(ticketsSchema), createTicket);

export { ticketsRouter };
