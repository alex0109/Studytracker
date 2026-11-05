import { redirect } from "next/navigation";

// The proxy already sends "/" on by sign-in state; this only answers if it ever lets one through
const Root = () => redirect("/home");

export default Root;
