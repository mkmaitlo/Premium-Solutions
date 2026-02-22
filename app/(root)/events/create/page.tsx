import EventForm from "@/components/shared/EventForm"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const CreateEvent = async () => {

    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId as string;
    const isAdmin  = sessionClaims?.isAdmin ?? false;
  
      if (!isAdmin) redirect('/')

  return (
    <>
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
            <h3 className="wrapper h3-bold text-center sm:text-left ">Create Event</h3>
        </section>

        <div className="wrapper my-8">
            <EventForm userId={userId} type="Create" />
        </div>
    </>
  )
}

export default CreateEvent  