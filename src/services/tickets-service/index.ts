import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

async function listTicketTypes() {
  const result = await ticketsRepository.listTicketTypes();
  if (!result) return [];
  return result;
}

async function getTickets(userId: number) {
  const checkEnrollment = await enrollmentRepository.checkEnrollment(userId);
  if (!checkEnrollment) {
    throw notFoundError();
  }

  const checkTicket = await ticketsRepository.getTicketsByEnrollment(checkEnrollment.id);
  if (!checkTicket) {
    throw notFoundError();
  }
  return checkTicket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.checkEnrollment(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticketData = {
    ticketTypeId: ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED
  };

  await ticketsRepository.postTicket(ticketData);
  const ticket = await ticketsRepository.getTicketsByEnrollment(enrollment.id);
  return ticket;
}

export default { listTicketTypes, getTickets, createTicket };
