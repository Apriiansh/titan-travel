import { getBookings } from "@/lib/actions/bookings";
import { BookingsClient } from "./BookingsClient";

export default async function BookingsPage() {
  const data = await getBookings();
  return <BookingsClient initialData={data as Parameters<typeof BookingsClient>[0]["initialData"]} />;
}
