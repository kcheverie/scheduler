export type AppointmentType = {
  id: string;
  name: "Appointment" | "Consultation" | "Check-In";
  length: number;
}

export type AppointmentSlot = {
  date: Date; //date and time 
  startTime: string; // '9:00'
  booked: boolean; //true if an appointment is booked during that time
}

export class Clinic {
  openingTime: number;
  closingTime: number;
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
    return start < end && start >= this.openingTime && end <= this.closingTime
  }

  getAppointmentSlots(startDate: Date, endDate: number): AppointmentSlot[] {
    return []
  }
}
