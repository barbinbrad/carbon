import { Queue } from "~/lib/bullmq";
import { getSupabaseAdmin } from "~/lib/supabase";
import { resendInvite } from "~/services/users";

export type ResendInvitesQueueData = {
  id: string;
};

const client = getSupabaseAdmin();

export const resendInvitesQueue = Queue<ResendInvitesQueueData>(
  "resendInvites:v1",
  async (job) => {
    await resendInvite(client, job.data.id);
  }
);
