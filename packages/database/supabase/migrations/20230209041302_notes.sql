CREATE TABLE "note" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "documentId" TEXT NOT NULL,
  "note" TEXT NOT NULL,
  "noteRichText" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "notes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "notes_documentId_index" ON "note"("documentId");

ALTER TABLE "note" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view notes" ON "note"
  FOR SELECT
  USING (
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees can insert notes" ON "note"
  FOR INSERT
  WITH CHECK (   
    (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees can update their own notes" ON "note"
  FOR UPDATE
  USING (
   (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND "createdBy"::uuid = auth.uid()
  );

CREATE POLICY "Employees can delete their own notes" ON "note"
  FOR DELETE
  USING (
    (get_my_claim('role'::text)) = '"employee"'::jsonb
    AND "createdBy"::uuid = auth.uid()
  );
