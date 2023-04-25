CREATE TABLE "document" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "size" INTEGER NOT NULL,
  "url" TEXT,
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
  'Archive',
  'Categorize'
  'Comment',
  'Download',
  'EditFile',
  'EditMeta',
  'EditPermissions',
  'Label',
  'Preview',
  'Rename',
  'Replace',
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