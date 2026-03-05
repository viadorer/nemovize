import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Neplatn\u00FD email"),
  password: z.string().min(6, "Heslo mus\u00ED m\u00EDt alespo\u0148 6 znak\u016F"),
})

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Jm\u00E9no mus\u00ED m\u00EDt alespo\u0148 2 znaky"),
    email: z.string().email("Neplatn\u00FD email"),
    password: z.string().min(6, "Heslo mus\u00ED m\u00EDt alespo\u0148 6 znak\u016F"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hesla se neshoduj\u00ED",
    path: ["confirmPassword"],
  })

export const clientSchema = z.object({
  firstName: z.string().min(1, "Jm\u00E9no je povinn\u00E9"),
  lastName: z.string().min(1, "P\u0159\u00EDjmen\u00ED je povinn\u00E9"),
  email: z.string().email("Neplatn\u00FD email").optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const propertySchema = z.object({
  title: z.string().min(1, "N\u00E1zev je povinn\u00FD"),
  description: z.string().optional(),
  propertyType: z.string().min(1, "Typ nemovitosti je povinn\u00FD"),
  transactionType: z.string().min(1, "Typ transakce je povinn\u00FD"),
  price: z.number().positive("Cena mus\u00ED b\u00FDt kladn\u00E1"),
  address: z.string().min(1, "Adresa je povinn\u00E1"),
  city: z.string().min(1, "M\u011Bsto je povinn\u00E9"),
  zip: z.string().optional(),
  floorArea: z.number().positive().optional(),
  lotArea: z.number().positive().optional(),
  rooms: z.number().int().positive().optional(),
  layout: z.string().optional(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().positive().optional(),
  construction: z.string().optional(),
  condition: z.string().optional(),
  energyRating: z.string().optional(),
  ownership: z.string().optional(),
})

export const valuationSchema = z.object({
  address: z.string().min(1, "Adresa je povinn\u00E1"),
  propertyType: z.string().min(1, "Typ nemovitosti je povinn\u00FD"),
  floorArea: z.number().positive("Plocha mus\u00ED b\u00FDt kladn\u00E1"),
  rooms: z.number().int().positive().optional(),
  floor: z.number().int().optional(),
  condition: z.string().optional(),
  name: z.string().min(1, "Jm\u00E9no je povinn\u00E9"),
  email: z.string().email("Neplatn\u00FD email"),
  phone: z.string().optional(),
})

export const inquirySchema = z.object({
  name: z.string().min(1, "Jm\u00E9no je povinn\u00E9"),
  email: z.string().email("Neplatn\u00FD email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Zpr\u00E1va je povinn\u00E1"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ClientInput = z.infer<typeof clientSchema>
export type PropertyInput = z.infer<typeof propertySchema>
export type ValuationInput = z.infer<typeof valuationSchema>
export type InquiryInput = z.infer<typeof inquirySchema>
