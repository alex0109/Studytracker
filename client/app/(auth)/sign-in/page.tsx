import Auth from "../page";
// import { redirect } from "next/navigation";
// import { getUser } from "@/queries/user";

export default async function SignInPage() {
  return <Auth mode="signin" />;
}
