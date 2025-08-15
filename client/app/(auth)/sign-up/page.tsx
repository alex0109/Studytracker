import Auth from "../page";
// import { redirect } from "next/navigation";
// import { getUser } from "@/queries/user";

export default async function SignUpPage() {
  //   const user = await getUser();
  //   if (user) {
  //     return redirect("/app");
  //   }

  return <Auth mode="signup" />;
}
