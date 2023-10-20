import { redirect } from "@remix-run/node";
import { path } from "~/utils/path";

export async function loader() {
  return redirect(path.to.people);
}
