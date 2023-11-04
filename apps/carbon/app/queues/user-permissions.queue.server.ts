import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import type { Permission } from "~/modules/users";
import { updatePermissions } from "~/modules/users/users.server";

export type UserPermissionsQueueData = {
  id: string;
  permissions: Record<string, Permission>;
  addOnly: boolean;
};

const client = getSupabaseServiceRole();

export const userPermissionsQueue = Queue<UserPermissionsQueueData>(
  "userPermissions:v1",
  async (job) => {
    await updatePermissions(client, job.data);
  }
);
