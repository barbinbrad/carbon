import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import type { Permission } from "~/interfaces/Users/types";
import { updatePermissions } from "~/services/users";

export type BulkPermissionsQueueData = {
  id: string;
  permissions: Record<string, Permission>;
  addOnly: boolean;
};

const client = getSupabaseServiceRole();

export const bulkPermissionsQueue = Queue<BulkPermissionsQueueData>(
  "editBulkPermissions:v1",
  async (job) => {
    await updatePermissions(client, job.data);
  }
);
