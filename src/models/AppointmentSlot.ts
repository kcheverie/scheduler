export type AppointmentSlot = {
  day: string; // "Monday, September 8"
  date: Date; //date and time 
  time: string; // '9:00'
  booked: boolean; //true if an appointment is booked during that time
}