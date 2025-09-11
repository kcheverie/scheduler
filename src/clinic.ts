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
    // convert times to decimals if needed ie 5:30 -> 17.5
    const start = startTime.getHours() + startTime.getMinutes() / 60
    const end = endTime.getHours() + endTime.getMinutes() / 60
    
      return start < end && start >= OPENING_TIME && end <= CLOSING_TIME

  }
}
