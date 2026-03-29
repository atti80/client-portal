"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addComment, deleteComment } from "@/lib/actions/comments";
import { formatDate, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  users: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
};

type Props = {
  deliverableId: string;
  comments: Comment[];
  currentUserId: string;
};

export function CommentSection({
  deliverableId,
  comments,
  currentUserId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await addComment(deliverableId, formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      const textarea = document.getElementById(
        `comment-${deliverableId}`
      ) as HTMLTextAreaElement;
      if (textarea) textarea.value = "";
      router.refresh();
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment?")) return;
    const result = await deleteComment(commentId);
    if (result?.error) toast.error(result.error);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => {
            const name =
              comment.users?.full_name || comment.users?.email || "Unknown";
            const isOwn = comment.user_id === currentUserId;
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium flex-shrink-0 mt-0.5 overflow-hidden">
                  {comment.users?.avatar_url ? (
                    <img
                      src={comment.users.avatar_url}
                      alt={name}
                      className="w-7 h-7 object-cover"
                    />
                  ) : (
                    getInitials(name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium text-stone-900">
                      {name}
                    </span>
                    <span className="text-xs text-stone-400">
                      {formatDate(comment.created_at)}
                    </span>
                    {isOwn && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-stone-400 hover:text-red-600 transition-colors ml-auto"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-stone-700 mt-0.5 leading-relaxed whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-stone-400">No comments yet.</p>
      )}

      <form
        action={handleSubmit}
        className="space-y-2 pt-2 border-t border-stone-100"
      >
        <Textarea
          id={`comment-${deliverableId}`}
          name="body"
          placeholder="Leave a comment..."
          rows={2}
          required
          className="bg-white border-stone-200 resize-none text-sm"
        />
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          size="sm"
          className="bg-stone-900 hover:bg-stone-700 text-white text-xs"
        >
          {loading ? "Posting..." : "Post comment"}
        </Button>
      </form>
    </div>
  );
}
