-- CreateTable
CREATE TABLE "usersProducts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "usersProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usersProducts" ADD CONSTRAINT "usersProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersProducts" ADD CONSTRAINT "usersProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
