import { redirect } from "next/navigation";

// This project only ships the authenticated dashboard experience.
// "/" simply forwards into it — swap for real auth logic later.
export default function RootPage() {
  redirect("/dashboard");
}
