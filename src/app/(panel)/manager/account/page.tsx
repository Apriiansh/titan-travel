import { getAccountData } from "@/lib/actions/account";
import { redirect } from "next/navigation";
import { AccountClient } from "@/components/panel/AccountClient";
import { PageHeader } from "@/components/panel/PageHeader";

export default async function ManagerAccountPage() {
  const user = await getAccountData();
  if (!user) redirect("/login");

  return (
    <>
      <PageHeader title="Akun Saya" description="Kelola profil dan keamanan akun Anda." />
      <AccountClient user={user} />
    </>
  );
}
