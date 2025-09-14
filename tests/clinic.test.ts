import { Clinic } from '../src/clinic';
import type { AppointmentType, AppointmentSlot } from '../src/models'

let clinic: Clinic;
let start: Date;
let end: Date;
let today: Date;


describe('Clinic', () => {
  beforeEach(() => {
    today = new Date("2025-09-08T13:00:00") //make sure "today" is always september 8 at 1pm
    clinic = new Clinic(9, 17) //initialize Clinic Hours
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