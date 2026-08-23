import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("app_token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Validation du token (ex: vérification JWT ou appel backend)
  try {
    const user = {
      id: "1",
      email: "user@test.com",
      name: "Arel",
      role: "developer",
    };
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
