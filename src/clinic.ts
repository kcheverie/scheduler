export type AppointmentType = {
  id: string;
  name: "Appointment" | "Consultation" | "Check-In";
  length: number;
}

export type AppointmentSlot = {
  day: string; // "Monday, September 8"
  date: Date; //date and time 
  time: string; // '9:00'
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
    const slots: AppointmentSlot[] = []
    let end = new Date()
    end.setDate(startDate.getDate() + endDate)

    // loop over the days
    for(let d = new Date(startDate); d <= end; d.setDate(d.getDate() + 1)) {
      //loop over the increments between open and close
      for (let hour = this.openingTime; hour < this.closingTime; hour += 0.5) {
        const slotDate = new Date(d)
        slotDate.setHours(Math.floor(hour), (hour % 1) ? 30 : 0, 0, 0)

        slots.push({
          day: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          time: `${Math.floor(hour).toString().padStart(2,'0')}:${(hour % 1 ? 30 : 0).toString().padStart(2,'0')}`,
          booked: false,
          date: slotDate
        });
      }

    }

    return slots;
  }
}
