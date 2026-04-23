import { getUsers } from "@/lib/actions/users";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
  const data = await getUsers();
  return <UsersClient initialData={data as Parameters<typeof UsersClient>[0]["initialData"]} />;
}
