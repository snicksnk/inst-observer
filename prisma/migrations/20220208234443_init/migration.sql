-- CreateTable
CREATE TABLE "Bot" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hasError" BOOLEAN NOT NULL,
    "error" TEXT NOT NULL,
    "session" JSONB,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_username_key" ON "Bot"("username");
