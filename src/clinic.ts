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
        id: 'stub-id', 
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

}

