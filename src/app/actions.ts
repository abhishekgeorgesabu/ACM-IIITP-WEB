
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitInquiry(data: z.infer<typeof formSchema>) {
  console.log("New inquiry:", data);
  // Here you would typically send an email, save to a database, etc.
  // We'll simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Thank you for your message! We'll get back to you soon." };
}
