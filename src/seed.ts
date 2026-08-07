import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Overrides system DNS for SRV queries

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductStatus } from './products/schemas/product.schema';
import { User, Role, UserStatus } from './users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productModel = app.get<Model<Product>>(getModelToken(Product.name));
  const userModel = app.get<Model<User>>(getModelToken(User.name));

  console.log('🌱 Starting database seeding...');

  // 1. Create Initial Admin User if it doesn't exist
  const adminEmail = 'admin@example.com';
  const existingAdmin = await userModel.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    await userModel.create({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    });
    console.log(
      '✅ Admin user created (Email: admin@example.com | Pass: AdminPassword123!)',
    );
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  // 2. Clear & Seed Sample Products
  await productModel.deleteMany({}); // Clears existing products to avoid duplicates

  const sampleProducts = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description:
        'High-fidelity audio with active noise cancellation and 30h battery life.',
      image: '/uploads/sample-headphones.jpg',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Ergonomic Mechanical Keyboard',
      description:
        'Tactile mechanical switches with customizable RGB backlighting.',
      image: '/uploads/sample-keyboard.jpg',
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Ultra-Wide 4K Gaming Monitor',
      description:
        '34-inch curved display with 144Hz refresh rate and HDR support.',
      image: '/uploads/sample-monitor.jpg',
      status: ProductStatus.ACTIVE,
    },
  ];

  await productModel.insertMany(sampleProducts);
  console.log(
    `✅ Seeded ${sampleProducts.length} sample products into MongoDB!`,
  );

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
