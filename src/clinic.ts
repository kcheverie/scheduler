const OPENING_TIME = 9
const CLOSING_TIME = 17

export type AppointmentType = {
  id: string;
  name: "Appointment" | "Consultation" | "Check-In";
  length: number;
}

export class Clinic {
  private openingTime: number;
  private closingTime: number;
  private appointmentTypes: AppointmentType[];

  constructor(openingTime: number, closingTime: number) {
    this.openingTime = openingTime;
    this.closingTime = closingTime;
    this.appointmentTypes = [
      { id: 'appt', name: "Appointment", length: 60 },
      { id: 'consult', name: "Consultation", length: 90 },
      { id: 'checkin', name: "Check-In", length: 30 },
    ] 
  }


  validateBooking(startTime: Date, endTime: Date): boolean {
    const start = startTime.getHours()
    const end = endTime.getHours()
    
      return start < end && start >= OPENING_TIME && end <= CLOSING_TIME

  }
}
