"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Archive,
  ArchiveRestore,
  Trash2,
  Pencil,
  Copy,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/supabaseClient";

// ============================================================================
// CONSTANTS
// ============================================================================

const PAGE_SIZE = 9;

// Doit rester synchronisé avec PLATFORMS dans app/generate/page.tsx
const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "TikTok", "X"];

// 'saved' n'est volontairement pas proposé comme filtre de statut ici : le
// "saved" fonctionnel de cette page passe par la table saved_posts (toggle
// Bookmark), pas par generated_posts.status. Voir note de design.
const STATUS_OPTIONS = ["generated", "edited", "archived"] as const;

const STATUS_LABEL: Record<string, string> = {
  generated: "Generated",
  edited: "Edited",
  archived: "Archived",
  saved: "Saved",
};

const STATUS_STYLE: Record<string, string> = {
  generated: "bg-slate-100 text-slate-600",
  edited: "bg-blue-50 text-blue-600",
  archived: "bg-amber-50 text-amber-700",
  saved: "bg-violet-50 text-violet-600",
};

// ============================================================================
// TYPES
// ============================================================================

interface GenerationSummary {
  id: string;
  platform: string;
  content_format: string;
  objective: string | null;
  tone: string | null;
  language: string | null;
  created_at: string;
}

interface HistoryPost {
  id: string;
  post_number: number;
  title: string | null;
  content: string | null;
  hook: string | null;
  caption: string | null;
  hashtags: string | null;
  cta: string | null;
  script: string | null;
  slides: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  generation: GenerationSummary;
  saved_posts: { id: string }[];
}

// ============================================================================
// HELPERS
// ============================================================================

function getPrimaryFieldName(
  post: HistoryPost,
): "content" | "script" | "caption" {
  if (post.content && post.content.trim()) return "content";
  if (post.script && post.script.trim()) return "script";
  return "caption";
}

function getPrimaryFieldValue(post: HistoryPost): string {
  const field = getPrimaryFieldName(post);
  return (post[field] as string | null) ?? "";
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HistoryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [posts, setPosts] = useState<HistoryPost[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ---- Auth guard ----
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // ---- Debounce search ----
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ---- Reset page on filter change ----
  useEffect(() => {
    setPage(0);
  }, [platformFilter, statusFilter, savedOnly, sortOrder]);

  // ---- Fetch ----
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setLoadError(null);

    try {
      // saved_posts est en !inner uniquement quand "Saved only" est actif,
      // pour que le join restreigne réellement les lignes retournées.
      const savedEmbed = savedOnly
        ? "saved_posts!inner(id)"
        : "saved_posts(id)";

      let query = supabase
        .from("generated_posts")
        .select(
          `
          id, post_number, title, content, hook, caption, hashtags, cta,
          script, slides, status, created_at, updated_at,
          generation:generations!inner (
            id, platform, content_format, objective, tone, language, created_at
          ),
          ${savedEmbed}
          `,
          { count: "exact" },
        )
        .eq("user_id", user.id);

      if (platformFilter) {
        query = query.eq("generation.platform", platformFilter);
      }
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }
      if (search) {
        const escaped = search.replace(/[%_]/g, "\\$&");
        query = query.or(
          `content.ilike.%${escaped}%,caption.ilike.%${escaped}%,hook.ilike.%${escaped}%,hashtags.ilike.%${escaped}%`,
        );
      }

      query = query
        .order("created_at", { ascending: sortOrder === "oldest" })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      setPosts((data as unknown as HistoryPost[]) ?? []);
      setTotalCount(count ?? 0);
    } catch (err: any) {
      console.error("Error loading history:", err);
      setLoadError("Could not load your content history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    user,
    supabase,
    platformFilter,
    statusFilter,
    savedOnly,
    search,
    sortOrder,
    page,
  ]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ---- Actions ----

  async function handleCopy(post: HistoryPost) {
    const text = getPrimaryFieldValue(post);
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId((id) => (id === post.id ? null : id)), 1500);
  }

  async function handleToggleSave(post: HistoryPost) {
    if (!user || busyId) return;
    const wasSaved = post.saved_posts.length > 0;
    setBusyId(post.id);

    try {
      if (wasSaved) {
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", user.id)
          .eq("generated_post_id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_posts")
          .insert({ user_id: user.id, generated_post_id: post.id });
        if (error) throw error;
      }

      if (savedOnly && wasSaved) {
        // Le post ne doit plus apparaître dans la vue "Saved only".
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setTotalCount((c) => Math.max(0, c - 1));
      } else {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, saved_posts: wasSaved ? [] : [{ id: "local" }] }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleArchive(post: HistoryPost) {
    if (busyId) return;
    const newStatus = post.status === "archived" ? "generated" : "archived";
    setBusyId(post.id);

    try {
      const { error } = await supabase
        .from("generated_posts")
        .update({ status: newStatus })
        .eq("id", post.id);
      if (error) throw error;

      if (statusFilter && statusFilter !== newStatus) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setTotalCount((c) => Math.max(0, c - 1));
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p)),
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(post: HistoryPost) {
    if (busyId) return;
    if (!confirm("Delete this post permanently? This cannot be undone."))
      return;
    setBusyId(post.id);

    try {
      const { error } = await supabase
        .from("generated_posts")
        .delete()
        .eq("id", post.id);
      if (error) throw error;
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(post: HistoryPost) {
    setEditingId(post.id);
    setEditDraft(getPrimaryFieldValue(post));
  }

  async function saveEdit(post: HistoryPost) {
    if (busyId) return;
    setBusyId(post.id);
    const field = getPrimaryFieldName(post);

    try {
      const { error } = await supabase
        .from("generated_posts")
        .update({ [field]: editDraft, status: "edited" })
        .eq("id", post.id);
      if (error) throw error;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, [field]: editDraft, status: "edited" } : p,
        ),
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error saving edit:", err);
    } finally {
      setBusyId(null);
    }
  }

  // ---- Early returns ----
  if (isLoading || !user) {
    return <div className="p-8">Vérification de la session...</div>;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ---- Render ----
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <header className="bg-white border-b border-slate-200 px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Your content history
          </h1>
          <p className="text-slate-500">
            Browse, edit, save, and manage everything you've generated.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* TOOLBAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search your posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none text-sm"
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white"
          >
            <option value="">All platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSavedOnly((v) => !v)}
            className={`px-3 py-2 rounded-lg text-sm border flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              savedOnly
                ? "bg-violet-50 border-violet-600 text-violet-700"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {savedOnly ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            Saved only
          </button>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-2 py-24 text-red-500 text-sm">
            <AlertCircle className="w-6 h-6" />
            {loadError}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <Inbox className="w-10 h-10 mx-auto mb-3" />
            <p>No posts match your filters yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post) => {
              const isSaved = post.saved_posts.length > 0;
              const isEditing = editingId === post.id;
              const isBusy = busyId === post.id;

              return (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-1 rounded">
                      {post.generation?.platform} ·{" "}
                      {post.generation?.content_format}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                        STATUS_STYLE[post.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {STATUS_LABEL[post.status] ?? post.status}
                    </span>
                  </div>

                  {post.hook && !isEditing && (
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      {post.hook}
                    </p>
                  )}

                  {isEditing ? (
                    <textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={6}
                      className="w-full text-sm border border-slate-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                      autoFocus
                    />
                  ) : (
                    <p className="text-slate-700 text-sm mb-3 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                      {getPrimaryFieldValue(post) || "—"}
                    </p>
                  )}

                  {!isEditing && post.hashtags && (
                    <p className="text-xs text-violet-500 mb-3">
                      {post.hashtags}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(post)}
                          disabled={isBusy}
                        >
                          {isBusy ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          disabled={isBusy}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleCopy(post)}
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          {copiedId === post.id ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => startEdit(post)}
                          disabled={isBusy}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleToggleSave(post)}
                          disabled={isBusy}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-3.5 h-3.5 mr-1 text-violet-600" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5 mr-1" />
                          )}
                          {isSaved ? "Saved" : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleToggleArchive(post)}
                          disabled={isBusy}
                        >
                          {post.status === "archived" ? (
                            <ArchiveRestore className="w-3.5 h-3.5 mr-1" />
                          ) : (
                            <Archive className="w-3.5 h-3.5 mr-1" />
                          )}
                          {post.status === "archived" ? "Unarchive" : "Archive"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-500 hover:text-red-600 border-red-100"
                          onClick={() => handleDelete(post)}
                          disabled={isBusy}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="mt-2 text-[11px] text-slate-400">
                    {new Date(post.created_at).toLocaleDateString()} · Post #
                    {post.post_number}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalCount > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
