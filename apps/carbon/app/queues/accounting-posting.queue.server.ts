import { Queue } from "~/lib/bullmq";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { postReceipt } from "~/modules/accounting";

export enum PostingQueueType {
  Receipt = "receipt",
}

export type PostingQueueData = {
  documentId: string;
  type: PostingQueueType;
};

const client = getSupabaseServiceRole();

export const postingQueue = Queue<PostingQueueData>(
  "posting:v1",
  async (job) => {
    switch (job.data.type) {
      case "receipt":
        await postReceipt(client, job.data.documentId);
        break;
      default:
        break;
    }
  }
);
