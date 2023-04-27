CREATE TABLE "document" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
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