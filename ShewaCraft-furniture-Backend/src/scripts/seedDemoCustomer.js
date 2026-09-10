import { User } from '../models/User.js';
import { hashPassword } from '../services/passwordService.js';

const DEMO_CUSTOMER = {
  fullName: 'Demo Customer',
  email: 'customer@shewacraft.com',
  password: 'Customer123!',
};

export async function seedDemoCustomer() {
  const email = DEMO_CUSTOMER.email;
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      fullName: DEMO_CUSTOMER.fullName,
      email,
      passwordHash: await hashPassword(DEMO_CUSTOMER.password),
      role: 'customer',
      status: 'active',
    });
    console.info(`[seed] Created demo customer: ${email}`);
  }

  const blockedEmail = 'blocked@shewacraft.com';
  const blocked = await User.findOne({ email: blockedEmail });
  if (!blocked) {
    await User.create({
      fullName: 'Blocked Customer',
      email: blockedEmail,
      passwordHash: await hashPassword('Blocked123!'),
      role: 'customer',
      status: 'blocked',
    });
    console.info(`[seed] Created blocked customer: ${blockedEmail}`);
  }
}
