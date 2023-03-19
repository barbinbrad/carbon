import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { deactivateUser } from "~/modules/users";

export type DeactivateUserQueueData = {
  id: string;
};

const client = getSupabaseServiceRole();

export const deactivateUsersQueue = Queue<DeactivateUserQueueData>(
  "deactivateUsers:v1",
  async (job) => {
    await deactivateUser(client, job.data.id);
  }
);
