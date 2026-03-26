import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logout berhasil" },
    { status: 200 }
  );

  // Cara menghapus cookie: Set nilainya ke kosong dan expires ke masa lalu
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
  });

  return response;
}
