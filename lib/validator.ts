import { z } from 'zod'

export const eventFormSchema = z.object({
    title: z.string().min(3, { message: 'Title must be atleat 3 characters' }),
    description: z.string().min(3, { message: 'Description must be atleast 3 characters' }),
    imageUrl: z.string().url({ message: 'Invalid image URL' }),
    startDateTime: z.date().refine((date) => date > new Date(), {
        message: 'Start date must be in the future',
    }),
    endDateTime: z.date().refine((date) => date > new Date(), {
        message: 'End date must be in the future',
    }),
    location: z.string().min(3, { message: 'Location is required' }).max(400, {message: "Location must be less than 400 characters"}),
    categoryId: z.string(),
    prize: z.string(),
    isFree: z.boolean(),
    url: z.string().url({ message: 'Invalid URL' }).optional(),
  })