import { isVercel } from "~/config/env";
import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { deactivateUser } from "~/services/users";

export type DeactivateUserQueueData = {
  id: string;
};

const client = getSupabaseServiceRole();

export const deactivateUsersQueue = isVercel()
  ? {
      addBulk: () => Promise.resolve(),
    }
  : Queue<DeactivateUserQueueData>("deactivateUsers:v1", async (job) => {
      await deactivateUser(client, job.data.id);
    });
