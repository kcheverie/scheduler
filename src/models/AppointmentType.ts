export type AppointmentType = {
  id: string;
  name: "Appointment" | "Consultation" | "Check-In";
  length: number;
}