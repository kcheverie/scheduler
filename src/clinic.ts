import type { AppointmentType, AppointmentSlot, Booking } from './models'

type BookingValidation = {
  valid: boolean;
  reason?: string;
}

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

  getAppointmentSlots(startDate: Date, days: number): AppointmentSlot[] {
    const slots: AppointmentSlot[] = [];
  
    // normalize to LOCAL midnight
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endExclusive = new Date(start);
    endExclusive.setDate(start.getDate() + days);
  
    for (let d = new Date(start); d < endExclusive; d.setDate(d.getDate() + 1)) {
      for (let half = this.openingTime * 2; half < this.closingTime * 2; half++) {
        const hour = Math.floor(half / 2);
        const minute = (half % 2) * 30;
  
        const slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0, 0);
        const slotEnd = new Date(slotDate.getTime() + 30 * 60 * 1000);
  
        const isBooked = this.bookings.some(b => slotDate < b.end && slotEnd > b.start);
  
        slots.push({
          day: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          time: `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`,
          booked: isBooked,
          date: slotDate,
        });
      }
    }
  
    return slots;
  }
  
  
  clearBookings() {
    this.bookings = [];
  }

  isBookingValid(start: Date, end: Date): BookingValidation {
    // convert times to decimals if needed ie 5:30 -> 17.5
    const startTime = start.getHours() + start.getMinutes() / 60
    const endTime = end.getHours() + end.getMinutes() / 60
  
    if (startTime < this.openingTime || endTime > this.closingTime || startTime >= endTime) {
      return { valid: false, reason: 'can not create a booking outside clinic hours' };
    }
     
    const now = this.nowFn();

    if (start.getTime() < now.getTime()) {
      return { valid: false, reason: 'can not create a booking in the past' }
    }

    const twoHoursFromNow = new Date(now);
    twoHoursFromNow.setHours(now.getHours() + 2)
    if (start.getTime() < twoHoursFromNow.getTime()) {
      return { valid: false, reason: 'can not create a booking in the next two hours' }
    }

    return {valid: true} //if all checks have passed
  }


  createBooking(date: Date, patientId: string, appointmentTypeId: string): Booking {
    if (!date || !patientId || !appointmentTypeId) {
      throw new Error('invalid booking data')
    }
    

    let appointmentType = this.appointmentTypes.find((appointmentType) => appointmentType.id === appointmentTypeId)
    
    if (!appointmentType) throw new Error('invalid appointment type')
    const bookingEnd = new Date(date.getTime() + appointmentType.length * 60 * 1000)
    
    
    const validation = this.isBookingValid(date, bookingEnd)
    
    const overlaps = this.bookings.some(booking => 
      date < booking.end && bookingEnd > booking.start
    )
    if (overlaps) {
      throw new Error("can not create a booking that overlaps with another booking")
    }

    if (validation.valid) {
      const newBooking = {
        id: `id-${date.getTime()}`, 
        patientId,
        appointmentTypeId,
        start: date,
        end: new Date(date.getTime() + appointmentType.length * 60 * 1000)
      }
  
      this.bookings.push(newBooking)
      return newBooking
    } else {
      throw new Error(validation.reason)
    }
  }

  getBookings(date?: Date) {
    return !date ? this.bookings : this.bookings.filter(b => 
      b.start.toDateString() === date.toDateString()
    );
  }

}

