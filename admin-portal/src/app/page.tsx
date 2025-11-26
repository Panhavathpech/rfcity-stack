import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/session";

export default async function Home() {
  const user = await getOptionalUser();
  if (user) {
    redirect("/contacts");
  }
  redirect("/login");
}
