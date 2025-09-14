export type AppointmentType = {
  id: 'appt' | 'checkin' | 'consult'
  name: 'Appointment' | 'Consultation' | 'Check-In'
  length: number
}