import { getAdminNameRequests } from '@/lib/adminData';
import { NameRequestsClient } from './NameRequestsClient';

export const dynamic = 'force-dynamic';

export default async function AdminNameRequestsPage() {
  const initialRequests = await getAdminNameRequests();

  return <NameRequestsClient initialRequests={initialRequests} />;
}
