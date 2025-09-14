import { Clinic } from '../src/clinic';
import type { AppointmentType, AppointmentSlot, Booking } from '../src/models'

let clinic: Clinic;
let start: Date;
let end: Date;
let today: Date;

describe('Clinic', () => {
  beforeEach(() => {
    today = new Date("2025-09-08T13:00:00") //make sure "today" is always september 8 at 1pm
    clinic = new Clinic(9, 17, () => today) //initialize Clinic Hours and today's date
    start = new Date(today);
    end = new Date(today);
  })

  test('a 9am start time and 10am end time is valid', () => {
    start.setHours(9, 0, 0, 0);
    end.setHours(10, 0, 0, 0);
    expect(clinic.validateBooking(start, end)).toBe(true);
  });
  
  test('a 7pm start time is invalid', () => {
    start.setHours(19, 0, 0, 0);
    end.setHours(20, 0, 0, 0);
    expect(clinic.validateBooking(start, end)).toBe(false);
  });
  
  test('a 5pm end time is valid', () => {
    start.setHours(16, 0, 0, 0);
    end.setHours(17, 0, 0, 0);
    expect(clinic.validateBooking(start, end)).toBe(true);
  });
  
  
  test('a 5:30pm end time is ivalid', () => {
    start.setHours(17, 30, 0, 0);
    end.setHours(18, 0, 0, 0);
    expect(clinic.validateBooking(start, end)).toBe(false);
  });
  
  
  test('an 4pm start time and a 5:30 pm end time is invalid', () => {
    start.setHours(16, 0, 0, 0);
    end.setHours(17, 30, 0, 0);
    expect(clinic.validateBooking(start, end)).toBe(false);
  });
  
  test('an end time can not be earlier than a start time', () => {
    start.setHours(3, 30, 0, 0);
    end.setHours(1, 0, 0, 0);
    expect(clinic.validateBooking(start, end)).toBe(false);
  });

})


describe('getAppointmentSlots', () => {
  let appointmentSlots: AppointmentSlot[];

  beforeEach(() => {
    appointmentSlots = clinic.getAppointmentSlots(today, 7); // generate 7 days of slots
  });

  test('is an array', () => {
    expect(Array.isArray(appointmentSlots)).toBe(true);
  });

  test('returns slots with the required properties', () => {
    appointmentSlots.forEach(slot => {
      expect(slot).toHaveProperty('day')
      expect(slot).toHaveProperty('time')
      expect(slot).toHaveProperty('date')
      expect(slot).toHaveProperty('booked')
    })
  })

  test('only returns slots that are not booked', () => {
    expect(appointmentSlots.every(slot => slot.booked === false)).toBe(true);
  });

  test('only returns slots within clinic hours', () => {
    appointmentSlots.forEach(slot => {
      const startTime = slot.date.getHours() + slot.date.getMinutes() / 60
      expect(startTime).toBeGreaterThanOrEqual(clinic.openingTime)
      expect(startTime).toBeLessThan(clinic.closingTime)
    })
  })
});

describe('createBooking', () => {
  beforeEach(() => {
    clinic.clearBookings();
  })

  describe('successful bookings', () => {
    test('a booking for a checkin can be created and it lasts 30 minutes', () => {
      const date = new Date("2025-09-09T15:30:00") 
      const booking = clinic.createBooking(date, 'patient01', 'checkin')
     
      console.log("BOOKING", booking.start)
      expect(booking.start.getTime()).toBe(date.getTime());
      const expectedEnd = new Date(date.getTime() + 30 * 60 * 1000)
      expect(booking.end.getTime()).toBe(expectedEnd.getTime())
    })
  
    test('a booking for an appointment can be created and it lasts 60 minutes', () => {
      const date = new Date("2025-09-09T15:30:00") 
      const booking = clinic.createBooking(date, 'patient01', 'appt')
      expect(booking.start.getTime()).toBe(date.getTime());
      const expectedEnd = new Date(date.getTime() + 60 * 60 * 1000)
      expect(booking.end.getTime()).toBe(expectedEnd.getTime())
    })
  
    test('a booking for a consultation can be created and it lasts 90 minutes', () => {
      const date = new Date("2025-09-09T15:30:00") 
      const booking = clinic.createBooking(date, 'patient01', 'consult')
      expect(booking.start.getTime()).toBe(date.getTime());
      const expectedEnd = new Date(date.getTime() + 90 * 60 * 1000)
      expect(booking.end.getTime()).toBe(expectedEnd.getTime())
    })
    
    test('allow back-to-back bookings', () => {
      //book at 4:00
      const dateFirstAppt = new Date("2025-09-09T16:00:00") 
      const firstBooking = clinic.createBooking(dateFirstAppt, 'patient01', 'checkin')

      //book at 4:30
      const dateSecondAppt = new Date("2025-09-09T16:30:00") 
      const secondBooking = clinic.createBooking(dateSecondAppt, 'patient01', 'checkin')

      expect(firstBooking).toBeDefined()
      expect(secondBooking).toBeDefined()
    })
  })

  describe('unsuccessful bookings', () => {

    test('can not creating a booking in the past', () => {
      const dateInPast = new Date("2025-09-08T10:00:00") 
      expect(() => clinic.createBooking(dateInPast, 'patient01', 'appt')).toThrow('can not create a booking in the past')
    })
  
    test('can not create booking that begins in the next two hours', () => {
      const dateNextTwoHours = new Date("2025-09-08T14:00:00") 
      expect(() => clinic.createBooking(dateNextTwoHours, 'patient01', 'appt')).toThrow('can not create a booking in the next two hours')
    })
  
    test('can not create a booking before clinic hours', () => {
      const dateEarly = new Date("2025-09-09T07:00:00") 
      expect(() => clinic.createBooking(dateEarly, 'patient01', 'appt')).toThrow('can not create a booking outside clinic hours')

    })
  
    test('can not create a booking after clinic hours', () => {
      const dateLate = new Date("2025-09-09T20:00:00") 
      expect(() => clinic.createBooking(dateLate, 'patient01', 'appt')).toThrow('can not create a booking outside clinic hours')

    })
  
    test('can not create a booking that overlaps with another booking', () => {
      //create booking for 4:00pm
      const dateFirstAppt = new Date("2025-09-09T16:00:00") 
      const firstBooking = clinic.createBooking(dateFirstAppt, 'patient01', 'appt')
      expect(firstBooking).toBeDefined()
      
      //attempt a booking for an appoinment that starts at 3:30
      const dateSecondAppt = new Date("2025-09-09T15:30:00") 
      expect(() => clinic.createBooking(dateSecondAppt, 'patient01', 'consult')).toThrow('can not create a booking that overlaps with another booking')
    })
  
    test('can not create a booking with an invalid appointment ID', () => {
      const date = new Date("2025-09-09T15:30:00") 
      expect(() => clinic.createBooking(date, 'patient01', 'appointment')).toThrow('invalid appointment type')
    })
  })
});