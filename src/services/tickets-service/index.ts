import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus, TicketType } from "@prisma/client";

export async function listTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.listTicketTypes();
  return ticketTypes;
}

async function userChecks(userId: number) {
  const checkEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
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
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED
  };

  await ticketsRepository.createTicket(ticketData);

  const ticket = await ticketsRepository.getTicketsByEnrollment(enrollment.id);

  return ticket;
}

export default { listTicketTypes, userChecks, createTicket };
