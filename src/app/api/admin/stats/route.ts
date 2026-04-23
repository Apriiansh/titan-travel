import { NextResponse } from "next/server";
import { getAdminStatsData } from "@/lib/actions/stats";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getAdminStatsData();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("API Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
