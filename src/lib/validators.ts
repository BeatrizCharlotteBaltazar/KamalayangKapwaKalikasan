import { z } from "zod";

export const volunteerSchema = z.object({
  full_name: z.string().min(2, "Kailangan ang buong pangalan."),
  email: z.string().email("Hindi wastong email address."),
  phone: z.string().min(7, "Kailangan ang numero ng telepono/mobile."),
  location: z.string().min(2, "Kailangan ang lokasyon (lungsod/lalawigan)."),
  interests: z.array(z.string()).min(1, "Pumili ng kahit isang interes."),
  availability: z.string().min(1, "Piliin ang inyong availability."),
  message: z.string().optional(),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Kailangang sumang-ayon sa Data Privacy Act (RA 10173).",
  }),
  honeypot: z.string().optional(),
});

export const donationSchema = z.object({
  donor_name: z.string().optional().transform((val) => (val && val.trim() ? val.trim() : "Anonymous")),
  email: z.string().email("Hindi wastong email address."),
  amount: z.number().positive("Kailangang positibong numero ang halaga ng donasyon."),
  reference_no: z.string().min(4, "Kailangan ang Reference Number mula sa resibo."),
  proof_url: z.string().optional(),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Kailangang sumang-ayon sa Data Privacy Act (RA 10173).",
  }),
  honeypot: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Hindi wastong email address."),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Kailangang sumang-ayon sa Data Privacy Act (RA 10173).",
  }),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Kailangan ang inyong pangalan."),
  email: z.string().email("Hindi wastong email address."),
  phone: z.string().optional(),
  subject: z.string().min(2, "Kailangan ang paksa."),
  message: z.string().min(5, "Pakihabaan ang nilalaman ng mensahe."),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Kailangang sumang-ayon sa Data Privacy Act (RA 10173).",
  }),
  honeypot: z.string().optional(),
});
