import { getAdminPayments } from '@/lib/adminData';
import { PaymentsClient } from './PaymentsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const initialTab = searchParams.tab || 'APPROVED';
  const initialProofs = await getAdminPayments(initialTab);

  return <PaymentsClient initialProofs={initialProofs} initialTab={initialTab} />;
}

