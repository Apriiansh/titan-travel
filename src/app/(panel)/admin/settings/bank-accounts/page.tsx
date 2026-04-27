import { getBankAccounts } from "@/lib/actions/bank-accounts";
import { BankAccountsClient } from "./BankAccountsClient";

export default async function BankAccountsPage() {
  const accounts = await getBankAccounts();
  return <BankAccountsClient initialAccounts={JSON.parse(JSON.stringify(accounts))} />;
}
