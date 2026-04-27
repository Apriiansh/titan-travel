"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBankAccounts() {
  return prisma.bankAccount.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveBankAccounts() {
  return prisma.bankAccount.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createBankAccount(data: {
  bankName: string;
  accountName: string;
  accountNumber: string;
  imageUrl?: string;
  sortOrder?: number;
}) {
  await prisma.bankAccount.create({ data });
  revalidatePath("/admin/settings/bank-accounts");
}

export async function updateBankAccount(
  id: string,
  data: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    imageUrl?: string | null;
    isActive?: boolean;
    sortOrder?: number;
  }
) {
  await prisma.bankAccount.update({ where: { id }, data });
  revalidatePath("/admin/settings/bank-accounts");
}

export async function deleteBankAccount(id: string) {
  await prisma.bankAccount.delete({ where: { id } });
  revalidatePath("/admin/settings/bank-accounts");
}
