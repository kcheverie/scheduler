import type { AppointmentType, AppointmentSlot, Booking } from './models'


export class Clinic {
  openingTime: number;
  closingTime: number;
  private appointmentTypes: AppointmentType[];
  private nowFn: () => Date;
  bookings: Booking[]

  constructor(openingTime: number, closingTime: number, nowFn: ()=> Date) {
    this.openingTime = openingTime;
    this.closingTime = closingTime;
    this.appointmentTypes = [
      { id: 'appt', name: "Appointment", length: 60 },
      { id: 'consult', name: "Consultation", length: 90 },
      { id: 'checkin', name: "Check-In", length: 30 },
    ];
    this.nowFn = nowFn; 
    this.bookings = [];
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
  
  clearBookings() {
    this.bookings = [];
  }

  createBooking(date: Date, patientId: string, appointmentTypeId: string): Booking {
    const now = this.nowFn();
    //stub test
    if (!date || !patientId || !appointmentTypeId) {
      throw new Error('invalid booking data')
    }

    let appointmentType = this.appointmentTypes.find((appointmentType) => appointmentType.id === appointmentTypeId)
    
    if (!appointmentType) throw new Error('invalid appointment type')
    
    const bookingEnd = new Date(date.getTime() + appointmentType.length * 60 * 1000)

    if (!this.validateBooking(date, bookingEnd)) {
      throw new Error('can not create a booking outside clinic hours')
    }

    if (date.getTime() < now.getTime()) {
      throw new Error('can not create a booking in the past')
    }

    const twoHoursFromNow = new Date(now);
    twoHoursFromNow.setHours(now.getHours() + 2)

    if (date.getTime() < twoHoursFromNow.getTime()) {
      throw new Error('can not create a booking in the next two hours')
    }



    const newBooking = {
      id: 'stub-id', 
      patientId,
      appointmentTypeId,
      start: date,
      end: new Date(date.getTime() + appointmentType.length * 60 * 1000)
    }

    const overlaps = this.bookings.some(booking => 
      newBooking.start < booking.end && newBooking.end > booking.start
    )

    if (overlaps) throw new Error ("can not create a booking that overlaps with another booking")

    this.bookings.push(newBooking)
    return newBooking
  }

}
