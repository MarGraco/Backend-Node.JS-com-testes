import { Appointment } from "../entities/appointment"
import { AppointmentsRepository } from "../repositories/appointments-repositorys"

interface CreateAppointmentRequest {
    customer: string;
    startsAt: Date;
    endsAt: Date;
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {
    constructor(
        private appointsmentsRepository: AppointmentsRepository
    ) {}


    async execute({
        customer, 
        startsAt, 
        endsAt
    }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const overlappingAppointment = await this.appointsmentsRepository.findOverlappingAppointment(
        startsAt,
        endsAt
    )

    if (overlappingAppointment) {
        throw new Error('Another appointment overlaps this appointment dates')
    }

    const appointment = new Appointment({
        customer,
        startsAt,
        endsAt
    })

    await this.appointsmentsRepository.create(appointment)
    
    return appointment

    }
}


