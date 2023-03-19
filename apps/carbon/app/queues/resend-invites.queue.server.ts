import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { resendInvite } from "~/modules/users";

export type ResendInvitesQueueData = {
  id: string;
};

const client = getSupabaseServiceRole();

export const resendInvitesQueue = Queue<ResendInvitesQueueData>(
  "resendInvites:v1",
  async (job) => {
    await resendInvite(client, job.data.id);
  }
);
