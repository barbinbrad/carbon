import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { deactivateUser, resendInvite } from "~/modules/users/users.server";

export enum UserAdminQueueType {
  Resend = "resend",
  Deactivate = "deactivate",
}

export type UserAdminQueueData = {
  id: string;
  type: UserAdminQueueType;
};

const client = getSupabaseServiceRole();

export const userAdminQueue = Queue<UserAdminQueueData>(
  "userAdmin:v1",
  async (job) => {
    switch (job.data.type) {
      case "resend":
        await resendInvite(client, job.data.id);
        break;
      case "deactivate":
        await deactivateUser(client, job.data.id);
        break;
      default:
        break;
    }
  }
);
