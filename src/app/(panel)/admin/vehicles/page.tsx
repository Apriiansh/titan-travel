import { getVehicleTypes } from "@/lib/actions/vehicle-types";
import { VehiclesClient } from "./VehiclesClient";

export default async function VehiclesPage() {
  const data = await getVehicleTypes();
  return <VehiclesClient initialData={data as Parameters<typeof VehiclesClient>[0]["initialData"]} />;
}
