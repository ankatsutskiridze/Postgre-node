import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Devices and gadgets",
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      description: "Apparel and fashion",
    },
  });

  // Create products and connect to categories
  await prisma.products.createMany({
    data: [
      {
        name: "iPhone 15",
        price: 999.99,
        stock: 20,
        description: "Latest Apple iPhone",
        slug: "iphone-15",
        categoryId: electronics.id,
      },
      {
        name: "Samsung Galaxy S24",
        price: 899.99,
        stock: 30,
        description: "Flagship Samsung phone",
        slug: "samsung-galaxy-s24",
        categoryId: electronics.id,
      },
      {
        name: "T-Shirt",
        price: 19.99,
        stock: 100,
        description: "Cotton T-shirt",
        slug: "t-shirt",
        categoryId: clothing.id,
      },
    ],
  });

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
