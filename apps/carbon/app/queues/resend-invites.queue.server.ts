import { isVercel } from "~/config/env";
import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { resendInvite } from "~/services/users";

export type ResendInvitesQueueData = {
  id: string;
};

const client = getSupabaseServiceRole();

export const resendInvitesQueue = isVercel()
  ? {
      addBulk: () => Promise.resolve(),
    }
  : Queue<ResendInvitesQueueData>("resendInvites:v1", async (job) => {
      await resendInvite(client, job.data.id);
    });
