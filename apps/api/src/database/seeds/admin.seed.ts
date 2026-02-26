import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { dataSourceOptions } from '../../config/data-source';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

async function seed(): Promise<void> {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const adminEmail = process.env['ADMIN_EMAIL'] ?? 'admin@example.com';
  const adminPassword = process.env['ADMIN_PASSWORD'] ?? 'admin123';
  const adminName = process.env['ADMIN_NAME'] ?? 'Admin';

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = userRepository.create({
    email: adminEmail,
    password: hashedPassword,
    name: adminName,
    role: Role.ADMIN,
  });

  await userRepository.save(admin);

  console.log(`Admin user created successfully:`);
  console.log(`  Email: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);

  await dataSource.destroy();
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
