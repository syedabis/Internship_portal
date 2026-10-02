'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Clock,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  Building2,
  GraduationCap,
  Filter,
  UserCheck,
  UserX,
  Plus,
  X,
  Mail,
  Phone,
  ArrowUpDown,
  Sparkles,
  Ban,
  AlertTriangle,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { MergedInternRecord } from '@/lib/internsParser';

interface ChapterOption {
  id: string;
  name: string;
  whatsapp_link?: string;
}

export default function AdminInternsPage() {
  const [interns, setInterns] = useState<MergedInternRecord[]>([]);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    joined: 0,
    pending: 0,
    blocked: 0,
    adoptionRate: 0,
    chaptersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'joined' | 'pending' | 'blocked'>('all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');

  // Copy feedback state
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Manual Assignment Modal
  const [selectedInternForAssign, setSelectedInternForAssign] = useState<MergedInternRecord | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [assigningPhone, setAssigningPhone] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Block Modal state
  const [selectedInternForBlock, setSelectedInternForBlock] = useState<MergedInternRecord | null>(null);
  const [blockReason, setBlockReason] = useState('Due to inconsistent performance and unfulfilled milestone requirements');
  const [blocking, setBlocking] = useState(false);

  // CSV Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvUploadText, setCsvUploadText] = useState('');
  const [uploadingCsv, setUploadingCsv] = useState(false);

  const fetchInternsData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/interns');
      if (!res.ok) throw new Error('Failed to fetch interns');
      const data = await res.json();
      if (data.success) {
        setInterns(data.interns || []);
        setChapters(data.chapters || []);
        setStats(data.stats || {
          total: 0,
          joined: 0,
          pending: 0,
          blocked: 0,
          adoptionRate: 0,
          chaptersCount: 0,
        });
      }
    } catch (err) {
      console.error('Error fetching admin interns:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInternsData();
  }, []);

  // Unique list of universities for dropdown filter
  const universities = useMemo(() => {
    const unis = new Set<string>();
    interns.forEach(i => {
      if (i.university && i.university.trim()) {
        unis.add(i.university.trim());
      }
    });
    return Array.from(unis).sort();
  }, [interns]);

  // Filtered interns list
  const filteredInterns = useMemo(() => {
    return interns.filter(item => {
      // Status filter
      if (statusFilter === 'blocked') {
        if (!item.isBlocked) return false;
      } else {
        // In other tabs, hide blocked unless "all"
        if (statusFilter === 'joined' && (!item.hasJoinedGroup || item.isBlocked)) return false;
        if (statusFilter === 'pending' && (item.hasJoinedGroup || item.isBlocked)) return false;
      }

      // University filter
      if (universityFilter !== 'all' && item.university !== universityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesPhone = (item.joinedPhone || item.phone || '').toLowerCase().includes(query);
        const matchesUni = (item.university || '').toLowerCase().includes(query);
        const matchesGroup = (item.joinedChapterName || '').toLowerCase().includes(query);
        const matchesCandId = (item.candidateId || '').toLowerCase().includes(query);
        const matchesReason = (item.blockedReason || '').toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesUni && !matchesGroup && !matchesCandId && !matchesReason) {
          return false;
        }
      }

      return true;
    });
  }, [interns, statusFilter, universityFilter, searchQuery]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleExportCSV = () => {
    if (interns.length === 0) return;

    const headers = [
      'Candidate ID',
      'Name',
      'Email',
      'University',
      'Group Status',
      'Joined Chapter Name',
      'WhatsApp Group Link',
      'Registered Phone',
      'Joined Date',
      'Offer Status'
    ];

    const rows = filteredInterns.map(i => [
      `"${i.candidateId || ''}"`,
      `"${i.name || ''}"`,
      `"${i.email || ''}"`,
      `"${i.university || ''}"`,
      `"${i.hasJoinedGroup ? 'Joined Group' : 'Pending Join'}"`,
      `"${i.joinedChapterName || ''}"`,
      `"${i.chapterWhatsappLink || ''}"`,
      `"${i.joinedPhone || i.phone || ''}"`,
      `"${i.joinedAt || i.responseDate || ''}"`,
      `"${i.offerStatus || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `interns_group_status_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAssignModal = (intern: MergedInternRecord) => {
    setSelectedInternForAssign(intern);
    setSelectedChapterId(intern.joinedChapterId || (chapters[0]?.id || ''));
    setAssigningPhone(intern.joinedPhone || intern.phone || '');
  };

  const handleSaveAssignment = async () => {
    if (!selectedInternForAssign || !selectedChapterId) return;

    const targetChapter = chapters.find(c => c.id === selectedChapterId);
    if (!targetChapter) return;

    setAssigning(true);
    try {
      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_group',
          email: selectedInternForAssign.email,
          name: selectedInternForAssign.name,
          phone: assigningPhone,
          chapterId: targetChapter.id,
          chapterName: targetChapter.name,
          university: selectedInternForAssign.university || targetChapter.name,
        }),
      });

      if (!res.ok) throw new Error('Failed to assign group');
      
      // Update local state immediately
      setInterns(prev => prev.map(item => {
        if (item.email.toLowerCase() === selectedInternForAssign.email.toLowerCase()) {
          return {
            ...item,
            hasJoinedGroup: true,
            joinedChapterId: targetChapter.id,
            joinedChapterName: targetChapter.name,
            joinedPhone: assigningPhone || item.joinedPhone,
            chapterWhatsappLink: targetChapter.whatsapp_link,
            joinedAt: new Date().toISOString(),
          };
        }
        return item;
      }));

      // Re-calculate stats
      setStats(prev => ({
        ...prev,
        joined: prev.joined + (selectedInternForAssign.hasJoinedGroup ? 0 : 1),
        pending: Math.max(0, prev.pending - (selectedInternForAssign.hasJoinedGroup ? 0 : 1)),
        adoptionRate: prev.total > 0 ? Math.round(((prev.joined + (selectedInternForAssign.hasJoinedGroup ? 0 : 1)) / prev.total) * 100) : 0,
      }));

      setSelectedInternForAssign(null);
    } catch (err: any) {
      alert(err.message || 'Error assigning group');
    } finally {
      setAssigning(false);
    }
  };

  const handleOpenBlockModal = (intern: MergedInternRecord) => {
    setSelectedInternForBlock(intern);
    setBlockReason('Due to inconsistent performance and unfulfilled milestone requirements');
  };

  const handleConfirmBlock = async () => {
    if (!selectedInternForBlock) return;
    setBlocking(true);
    try {
      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block_intern',
          email: selectedInternForBlock.email,
          name: selectedInternForBlock.name,
          reason: blockReason,
        }),
      });

      if (!res.ok) throw new Error('Failed to block intern');

      const wasJoined = selectedInternForBlock.hasJoinedGroup;

      setInterns(prev => prev.map(item => {
        if (item.email.toLowerCase().trim() === selectedInternForBlock.email.toLowerCase().trim()) {
          return {
            ...item,
            isBlocked: true,
            blockedReason: blockReason,
            blockedAt: new Date().toISOString(),
          };
        }
        return item;
      }));

      setStats(prev => ({
        ...prev,
        blocked: prev.blocked + 1,
        joined: wasJoined ? Math.max(0, prev.joined - 1) : prev.joined,
        pending: !wasJoined ? Math.max(0, prev.pending - 1) : prev.pending,
      }));

      setSelectedInternForBlock(null);
    } catch (err: any) {
      alert(err.message || 'Error blocking intern');
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async (intern: MergedInternRecord) => {
    if (!confirm(`Are you sure you want to unblock ${intern.name || intern.email}? Their portal access and actions will be restored.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unblock_intern',
          email: intern.email,
        }),
      });

      if (!res.ok) throw new Error('Failed to unblock intern');

      setInterns(prev => prev.map(item => {
        if (item.email.toLowerCase().trim() === intern.email.toLowerCase().trim()) {
          return {
            ...item,
            isBlocked: false,
            blockedReason: undefined,
            blockedAt: undefined,
          };
        }
        return item;
      }));

      setStats(prev => ({
        ...prev,
        blocked: Math.max(0, prev.blocked - 1),
        joined: intern.hasJoinedGroup ? prev.joined + 1 : prev.joined,
        pending: !intern.hasJoinedGroup ? prev.pending + 1 : prev.pending,
      }));
    } catch (err: any) {
      alert(err.message || 'Error unblocking intern');
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvUploadText(text);
    };
    reader.readAsText(file);
  };

  const handleSaveUploadedCsv = async () => {
    if (!csvUploadText.trim()) {
      alert('Please select or paste valid CSV data');
      return;
    }

    setUploadingCsv(true);
    try {
      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload_csv',
          csvText: csvUploadText,
        }),
      });

      if (!res.ok) throw new Error('Failed to update CSV');
      setShowUploadModal(false);
      setCsvUploadText('');
      await fetchInternsData();
    } catch (err: any) {
      alert(err.message || 'Error updating CSV');
    } finally {
      setUploadingCsv(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Roster & Group Tracking
            </span>
            <span className="text-xs text-slate-500 font-medium">Source: interns.csv</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Interns & Chapter Groups
          </h1>
          <p className="text-sm text-slate-600">
            Monitor which accepted candidates have selected their campus chapter and joined official WhatsApp groups.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchInternsData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            title="Refresh from interns.csv & Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Update CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Interns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-600">Total Interns</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.total}</span>
            <span className="text-xs font-semibold text-slate-500">Accepted Candidates</span>
          </div>
        </div>

        {/* Joined Group */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/60 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Joined Group</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{stats.joined}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {stats.adoptionRate}% rate
            </span>
          </div>
        </div>

        {/* Pending Group */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-700">Pending Join</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{stats.pending}</span>
            <span className="text-xs font-semibold text-amber-700">Awaiting Chapter</span>
          </div>
        </div>

        {/* Blocked / Failed */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/60 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-rose-700">Blocked / Failed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{stats.blocked || 0}</span>
            <span className="text-xs font-semibold text-rose-700">Access Suspended</span>
          </div>
        </div>

        {/* Total Chapters Available */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-600">Available Chapters</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{chapters.length || 148}</span>
            <span className="text-xs font-semibold text-slate-500">Campuses & Cities</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Controls / Filters Header */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({interns.length})
            </button>
            <button
              onClick={() => setStatusFilter('joined')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'joined'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Joined ({stats.joined})</span>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending ({stats.pending})</span>
            </button>
            <button
              onClick={() => setStatusFilter('blocked')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'blocked'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Blocked ({stats.blocked || 0})</span>
            </button>
          </div>

          {/* Search & University Filter */}
          <div className="flex items-center gap-3 flex-1 lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search intern name, email, university, or group..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* University Dropdown */}
            <select
              value={universityFilter}
              onChange={e => setUniversityFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 max-w-[200px] truncate"
            >
              <option value="all">All Universities ({universities.length})</option>
              {universities.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading Interns & Group Assignments...</p>
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-base font-bold text-slate-700">No interns found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          /* Responsive Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Intern / Candidate</th>
                  <th className="py-3.5 px-4">University</th>
                  <th className="py-3.5 px-4">Group Status</th>
                  <th className="py-3.5 px-4">WhatsApp Link</th>
                  <th className="py-3.5 px-4">Offer / Join Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredInterns.map((intern, index) => {
                  const isJoined = intern.hasJoinedGroup;
                  const waInviteUrl = intern.chapterWhatsappLink;

                  return (
                    <tr
                      key={intern.candidateId || intern.email || index}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isJoined ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center text-slate-600 font-mono font-bold">
                        {index + 1}
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            {intern.name}
                            {isJoined && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {intern.email}
                          </span>
                          {intern.joinedPhone || intern.phone ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <a
                                href={`https://wa.me/${(intern.joinedPhone || intern.phone || '').replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-mono flex items-center gap-1 font-bold hover:underline"
                                title="Open direct WhatsApp chat"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {intern.joinedPhone || intern.phone}
                              </a>

                              <button
                                type="button"
                                onClick={() => handleCopy(intern.joinedPhone || intern.phone || '')}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors"
                                title="Copy Phone Number"
                              >
                                {copiedLink === (intern.joinedPhone || intern.phone) ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-300" />
                              No phone on file
                            </span>
                          )}
                        </div>
                      </td>

                      {/* University */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]" title={intern.university}>
                            {intern.university || 'Not Specified'}
                          </span>
                        </div>
                      </td>

                      {/* Group Status */}
                      <td className="py-3.5 px-4">
                        {intern.isBlocked ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <Ban className="w-3 h-3 text-rose-600" />
                              Blocked / Failed
                            </span>
                            <span className="text-[10px] text-rose-700 font-medium truncate max-w-[200px]" title={intern.blockedReason}>
                              {intern.blockedReason || 'Due to inconsistent performance'}
                            </span>
                          </div>
                        ) : isJoined ? (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Joined Group
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[220px]" title={intern.joinedChapterName}>
                              {intern.joinedChapterName}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 items-start">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending Join
                            </span>
                            <span className="text-[10px] text-slate-600">No chapter selected</span>
                          </div>
                        )}
                      </td>

                      {/* WhatsApp Link Column */}
                      <td className="py-3.5 px-4">
                        {intern.isBlocked ? (
                          <span className="text-[11px] text-rose-400 italic">Access Revoked</span>
                        ) : waInviteUrl ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={waInviteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] transition-colors"
                              title="Open WhatsApp Group"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Open Group</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>

                            <button
                              onClick={() => handleCopy(waInviteUrl)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Copy Group Link"
                            >
                              {copiedLink === waInviteUrl ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No link assigned</span>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col text-[11px]">
                          {intern.isBlocked && intern.blockedAt ? (
                            <span className="text-rose-700 font-semibold">
                              Blocked: {new Date(intern.blockedAt).toLocaleDateString()}
                            </span>
                          ) : intern.joinedAt ? (
                            <span className="text-emerald-700 font-semibold">
                              Joined: {new Date(intern.joinedAt).toLocaleDateString()}
                            </span>
                          ) : null}
                          <span className="text-slate-500">
                            Offer: {intern.offerSentDate || '2026-09-15'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {intern.isBlocked ? (
                            <button
                              type="button"
                              onClick={() => handleUnblock(intern)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Restore and unblock intern"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-600" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenAssignModal(intern)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                              >
                                {isJoined ? 'Change Group' : 'Assign Group'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenBlockModal(intern)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Block / Fail Intern (Due to inconsistent performance)"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick WhatsApp Reminder */}
                              {(() => {
                                const rawPhone = (intern.joinedPhone || intern.phone || '').replace(/[^0-9]/g, '');
                                const waUrl = rawPhone
                                  ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                                      `Hi ${intern.name}! We're thrilled to welcome you to the Cortexa AI Changemaker Program. Please select and join your official chapter group on the portal: https://internship.datacrumbs.org/chapters`
                                    )}`
                                  : `https://wa.me/?text=${encodeURIComponent(
                                      `Hi ${intern.name}! We're thrilled to welcome you to the Cortexa AI Changemaker Program. Please select and join your official chapter group on the portal: https://internship.datacrumbs.org/chapters`
                                    )}`;

                                return (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    title={rawPhone ? `Chat on WhatsApp (${intern.joinedPhone || intern.phone})` : "Send WhatsApp Follow-up"}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                );
                              })()}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <strong className="text-slate-800">{filteredInterns.length}</strong> of{' '}
            <strong className="text-slate-800">{interns.length}</strong> interns
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time status synchronized with Supabase & CSV
          </span>
        </div>
      </div>

      {/* MODAL: Assign / Change Group */}
      {selectedInternForAssign && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Assign Group: {selectedInternForAssign.name}
              </h3>
              <button
                onClick={() => setSelectedInternForAssign(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Candidate Email</label>
                <input
                  type="text"
                  disabled
                  value={selectedInternForAssign.email}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Select Chapter / WhatsApp Group *</label>
                <select
                  value={selectedChapterId}
                  onChange={e => setSelectedChapterId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {chapters.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">WhatsApp Phone Number</label>
                <input
                  type="text"
                  value={assigningPhone}
                  onChange={e => setAssigningPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInternForAssign(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assigning}
                onClick={handleSaveAssignment}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs disabled:opacity-50"
              >
                {assigning ? 'Saving...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Upload / Update CSV */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                Update interns.csv
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Upload a new export or paste the updated CSV raw content to refresh the intern roster.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Choose CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Or Paste CSV Content</label>
                <textarea
                  rows={6}
                  value={csvUploadText}
                  onChange={e => setCsvUploadText(e.target.value)}
                  placeholder="Candidate ID,Candidate Name,Email Address,Domain,University..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={uploadingCsv || !csvUploadText.trim()}
                onClick={handleSaveUploadedCsv}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs disabled:opacity-50"
              >
                {uploadingCsv ? 'Saving...' : 'Save & Overwrite CSV'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Block / Fail Intern */}
      {selectedInternForBlock && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Block Intern / Revoke Access
              </h3>
              <button
                onClick={() => setSelectedInternForBlock(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Account Suspension Action</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-700">
                  Blocking <strong>{selectedInternForBlock.name}</strong> will revoke all portal actions (milestones, chapters, claims). A notice banner stating <em>&quot;Due to inconsistent performance...&quot;</em> will be displayed across their dashboard.
                </p>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Candidate</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedInternForBlock.name} (${selectedInternForBlock.email})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Reason for Suspension / Failure</label>
                <textarea
                  rows={3}
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-rose-500"
                />

                {/* Preset Reason Pills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    'Due to inconsistent performance and unfulfilled milestone requirements',
                    'Zero weekly submissions and unresponsiveness',
                    'Failure to meet minimum evaluation threshold',
                    'Code of conduct & policy violation'
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBlockReason(preset)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium transition-colors"
                    >
                      {preset.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInternForBlock(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={blocking}
                onClick={handleConfirmBlock}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{blocking ? 'Suspending...' : 'Confirm Block & Suspend'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
