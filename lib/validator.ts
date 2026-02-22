import * as z from "zod"


export const eventFormSchema = z.object({
    title: z.string().min(3,"Title must be atleast 3 characters"),
    description:z.string().min(10, "Description must be atleast 10 characters").max(400,"Description must be less then 400 characters"),
    imageUrl:z.string(),
    price: z.string(),
})