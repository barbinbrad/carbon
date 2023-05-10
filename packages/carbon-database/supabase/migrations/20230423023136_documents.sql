CREATE TABLE "document" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "path" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT DEFAULT '',
  "size" INTEGER NOT NULL,
  "type" TEXT GENERATED ALWAYS AS (split_part("name", '.', -1)) STORED,
  "readGroups" TEXT[],
  "writeGroups" TEXT[],
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "document_pkey" PRIMARY KEY ("id"),
  
  CONSTRAINT "document_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "document_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "document_visibility_idx" ON "document" USING GIN ("readGroups", "writeGroups");

ALTER TABLE "document" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users with documents_view can view documents where they are in the readGroups" ON "document" 
  FOR SELECT USING (
    coalesce(get_my_claim('documents_view')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "readGroups") = true
  );

CREATE POLICY "Users with documents_create can create documents where they are in the writeGroups" ON "document" 
  FOR INSERT WITH CHECK (
    coalesce(get_my_claim('documents_create')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "writeGroups") = true
  );

CREATE POLICY "Users with documents_update can update documents where they are in the writeGroups" ON "document"
  FOR UPDATE USING (
    coalesce(get_my_claim('documents_update')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "writeGroups") = true
  );

CREATE POLICY "Users with documents_delete can delete documents where they are in the writeGroups" ON "document"
  FOR DELETE USING (
    coalesce(get_my_claim('documents_delete')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "writeGroups") = true
  );

CREATE POLICY "Private buckets view requires ownership or document.readGroups" ON storage.objects 
FOR SELECT USING (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_view')::boolean, false) = true
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR storage.filename(name) IN (
            SELECT "path" FROM public.document WHERE "readGroups" && groups_for_user(auth.uid()::text)
        )
    )
);

CREATE POLICY "Private buckets insert requires ownership or document.writeGroups" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_create')::boolean, false) = true
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR storage.filename(name) IN (
            SELECT "path" FROM public.document WHERE "writeGroups" && groups_for_user(auth.uid()::text)
        )
    )
);

CREATE POLICY "Private buckets update requires ownership or document.writeGroups" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_update')::boolean, false) = true
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR storage.filename(name) IN (
            SELECT "path" FROM public.document WHERE "readGroups" && groups_for_user(auth.uid()::text)
        )
    )
);

CREATE POLICY "Private buckets delete requires ownership or document.writeGroups" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'private'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('documents_delete')::boolean, false) = true
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR storage.filename(name) IN (
            SELECT "path" FROM public.document WHERE "readGroups" && groups_for_user(auth.uid()::text)
        )
    )
);

CREATE TYPE "documentTransactionType" AS ENUM (
  'Delete',
  'Download',
  'Edit',
  'Favorite',
  'Label',
  'Unfavorite',
  'Upload'
);

CREATE TABLE "documentTransaction" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "documentId" TEXT NOT NULL,
  "type" "documentTransactionType" NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "documentActivity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "documentActivity_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE,
  CONSTRAINT "documentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "documentActivity_documentId_idx" ON "documentTransaction" ("documentId");
CREATE INDEX "documentActivity_userId_idx" ON "documentTransaction" ("userId");

CREATE TABLE "documentFavorite" (
  "documentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,

  CONSTRAINT "documentFavorites_pkey" PRIMARY KEY ("documentId", "userId"),
  CONSTRAINT "documentFavorites_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE,
  CONSTRAINT "documentFavorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "documentFavorites_userId_idx" ON "documentFavorite" ("userId");
CREATE INDEX "documentFavorites_documentId_idx" ON "documentFavorite" ("documentId");

CREATE TABLE "documentLabel" (
  "documentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "label" TEXT NOT NULL,

  CONSTRAINT "documentLabels_pkey" PRIMARY KEY ("documentId", "userId", "label"),
  CONSTRAINT "documentLabels_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE,
  CONSTRAINT "documentLabels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "documentLabels_userId_idx" ON "documentLabel" ("userId");
CREATE INDEX "documentLabels_documentId_idx" ON "documentLabel" ("documentId");
CREATE INDEX "documentLabels_label_idx" ON "documentLabel" ("label");

CREATE FUNCTION public.upload_document_transaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."documentTransaction" ("documentId", "type", "userId")
  VALUES (new.id, 'Upload', new."createdBy");

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER upload_document_transaction
  AFTER INSERT on public."document"
  FOR EACH ROW EXECUTE PROCEDURE public.upload_document_transaction();

CREATE FUNCTION public.edit_document_transaction()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."documentTransaction" ("documentId", "type", "userId")
  VALUES (new.id, 'Edit', new."createdBy");

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER edit_document_transaction
  AFTER UPDATE on public."document"
  FOR EACH ROW EXECUTE PROCEDURE public.edit_document_transaction();

CREATE VIEW "documents_labels_view" AS
  SELECT DISTINCT
    "label",
    "userId"
  FROM "documentLabel";

CREATE VIEW "documents_view" AS 
  SELECT
    d.id,
    d.path,
    d.name,
    d.description,
    d.size,
    d.type,
    d.active,
    d."readGroups",
    d."writeGroups",
    d."createdBy",
    u."avatarUrl" AS "createdByAvatar",
    u."fullName" AS "createdByFullName",
    d."createdAt",
    d."updatedBy",
    u2."avatarUrl" AS "updatedByAvatar",
    u2."fullName" AS "updatedByFullName",
    d."updatedAt",
    ARRAY(SELECT dl.label FROM "documentLabel" dl WHERE dl."documentId" = d.id AND dl."userId" = auth.uid()::text) AS labels,
    EXISTS(SELECT 1 FROM "documentFavorite" df WHERE df."documentId" = d.id AND df."userId" = auth.uid()::text) AS favorite
  FROM "document" d
  LEFT JOIN "user" u ON u.id = d."createdBy"
  LEFT JOIN "user" u2 ON u2.id = d."updatedBy";