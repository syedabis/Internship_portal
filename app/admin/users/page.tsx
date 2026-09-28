import { getAdminUsers, getAdminCoupons } from '@/lib/adminData';
import { UsersClient } from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const initialUsers = await getAdminUsers();
  const initialCoupons = await getAdminCoupons();

  return <UsersClient initialUsers={initialUsers} initialCoupons={initialCoupons} />;
}

