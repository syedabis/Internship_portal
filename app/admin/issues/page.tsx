import { getAdminIssues } from '@/lib/adminData';
import { IssuesClient } from './IssuesClient';

export const dynamic = 'force-dynamic';

export default async function AdminIssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }> | { status?: string; page?: string };
}) {
  const resolvedParams = await Promise.resolve(searchParams);
  const initialStatus = resolvedParams?.status || 'OPEN';
  const initialPage = parseInt(resolvedParams?.page || '1', 10);
  const initialData = await getAdminIssues(initialStatus, initialPage);

  return (
    <IssuesClient
      initialData={initialData}
      initialStatus={initialStatus}
      initialPage={initialPage}
    />
  );
}
