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

CREATE POLICY "users with documents_view can view documents where they are in the readGroups" ON "document" 
  FOR SELECT USING (
    coalesce(get_my_claim('documents_view')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "readGroups") = true
  );

CREATE POLICY "users with documents_create can create documents where they are in the writeGroups" ON "document" 
  FOR INSERT WITH CHECK (
    coalesce(get_my_claim('documents_create')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "writeGroups") = true
  );

CREATE POLICY "users with documents_update can update documents where they are in the writeGroups" ON "document"
  FOR UPDATE USING (
    coalesce(get_my_claim('documents_update')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "writeGroups") = true
  );

CREATE POLICY "users with documents_delete can delete documents where they are in the writeGroups" ON "document"
  FOR DELETE USING (
    coalesce(get_my_claim('documents_delete')::boolean, false) = true 
    AND (groups_for_user(auth.uid()::text) && "writeGroups") = true
  );

CREATE TYPE "documentTransactionType" AS ENUM (
  'Categorize',
  'Comment',
  'Delete',
  'Download',
  'EditPermissions',
  'Favorite',
  'Label',
  'Preview',
  'Rename',
  'Replace',
  'Unfavorite'
  'Upload'
);

CREATE TABLE "documentTransactions" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "documentId" TEXT NOT NULL,
  "type" "documentTransactionType" NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "documentActivity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "documentActivity_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE CASCADE,
  CONSTRAINT "documentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "documentActivity_documentId_idx" ON "documentTransactions" ("documentId");

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

CREATE OR REPLACE FUNCTION documents_query(
  _uid TEXT DEFAULT NULL
) 
RETURNS TABLE (
  "id" TEXT,
  "name" TEXT,
  "description" TEXT,
  "size" INTEGER,
  "type" TEXT,
  "createdByAvatar" TEXT,
  "createdByFullName" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedByAvatar" TEXT,
  "updatedByFullName" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "labels" TEXT[],
  "favorite" BOOLEAN
) LANGUAGE "plpgsql" SECURITY INVOKER SET search_path = public
AS $$
  BEGIN
    RETURN QUERY
SELECT
    d.id,
    d.name,
    d.description,
    d.size,
    d.type,
    u.avatar AS "createdByAvatar",
    u."fullName" AS "createdByFullName",
    d."createdAt",
    u2.avatar AS "updatedByAvatar",
    u2."fullName" AS "updatedByFullName",
    d."updatedAt",
    ARRAY(SELECT dl.label FROM "documentLabel" dl WHERE dl."documentId" = d.id AND dl."userId" = _uid) AS labels,
    EXISTS(SELECT 1 FROM "documentFavorite" df WHERE df."documentId" = d.id AND df."userId" = _uid) AS favorite
  FROM "document" d
  INNER JOIN "user" u ON u.id = d."createdBy"
  LEFT JOIN "user" u2 ON u2.id = d."updatedBy"
  WHERE d.active = TRUE;
END;
$$;
