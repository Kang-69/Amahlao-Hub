import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Heart,
  Send,
  DiscordLogo,
  User,
  Clock,
  Tag,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Flame,
  TrendingUp,
  Star,
  Zap,
  Menu,
  ExternalLink,
} from "./components/Icons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  liked: boolean;
  comments: number;
  createdAt: Date;
  pinned?: boolean;
}

// ─── Avatar Colors ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_POSTS: Post[] = [
  {
    id: generateId(),
    author: "AmahlaoAdmin",
    avatar: "A",
    title: "Welcome to Amahlao-Hub! 🎉",
    content:
      "Hey everyone! Welcome to the official Amahlao-Hub community. This is your space to share ideas, connect with others, and stay updated. Make sure to join our Discord for real-time chat and announcements. Let's build something amazing together!",
    category: "Announcement",
    likes: 42,
    liked: false,
    comments: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    pinned: true,
  },
  {
    id: generateId(),
    author: "StarPlayer",
    avatar: "S",
    title: "Just joined the community — looking forward to it!",
    content:
      "Hey all! I'm new here. Found Amahlao-Hub through a friend and I'm really impressed with what I see. Excited to be part of this community. Hit me up if you want to collaborate on anything!",
    category: "Introduction",
    likes: 18,
    liked: false,
    comments: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: generateId(),
    author: "NightCrawler",
    avatar: "N",
    title: "Tips for staying productive while gaming",
    content:
      "We all love gaming, but it's important to stay productive too. Here are my top 3 tips: 1) Set a timer for gaming sessions, 2) Take breaks every hour to stretch and hydrate, 3) Prioritize your tasks before jumping into a game. What are your tips?",
    category: "Discussion",
    likes: 27,
    liked: false,
    comments: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: generateId(),
    author: "CreativeMind",
    avatar: "C",
    title: "Showcasing my latest artwork 🎨",
    content:
      "I've been working on some digital art pieces inspired by the Amahlao-Hub aesthetic. The purple and dark themes really speak to me. Would love to hear what you all think and if anyone wants to collaborate on art projects!",
    category: "Showcase",
    likes: 35,
    liked: false,
    comments: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Announcement",
  "Discussion",
  "Introduction",
  "Showcase",
  "Question",
  "Off-Topic",
];

const CATEGORY_COLORS: Record<string, string> = {
  Announcement: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Discussion: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Introduction: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Showcase: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Question: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Off-Topic": "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

// ─── Navbar Component ────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-50/90 backdrop-blur-xl border-b border-brand-700/20 shadow-lg shadow-brand-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30 transition-transform group-hover:scale-110">
              <Zap className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">
              Amahlao-Hub
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#posts"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Posts
            </a>
            <a
              href="#create"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Create
            </a>
            <a
              href="https://discord.gg/S89f2Mzt6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5865F2]/25 transition-all hover:bg-[#4752C4] hover:shadow-[#5865F2]/40 hover:-translate-y-0.5"
            >
              <DiscordLogo className="h-4 w-4" />
              Discord
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-b border-brand-700/20 bg-surface-50/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#posts"
              className="block text-sm text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Posts
            </a>
            <a
              href="#create"
              className="block text-sm text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Create
            </a>
            <a
              href="https://discord.gg/S89f2Mzt6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white"
            >
              <DiscordLogo className="h-4 w-4" />
              Discord
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Component ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-800/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-700/5 blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300 mb-8 animate-fade-in">
          <Flame className="h-4 w-4 text-brand-400" />
          <span>Community-Driven Hub</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
          <span className="gradient-text">Amahlao-Hub</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-10 animate-fade-in">
          Your community space to share ideas, connect with others, and stay in
          the loop. Create posts, join discussions, and be part of something
          great.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <a
            href="#create"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-600/25 transition-all hover:shadow-brand-600/40 hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-600"
          >
            <Plus className="h-4 w-4" />
            Create a Post
          </a>
          <a
            href="https://discord.gg/S89f2Mzt6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-400/50 bg-surface-200/50 px-8 py-3.5 text-sm font-bold text-slate-300 transition-all hover:border-brand-500/50 hover:text-white hover:bg-surface-200"
          >
            <DiscordLogo className="h-4 w-4" />
            Join Discord
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-brand-400 mr-1.5" />
              <span className="text-2xl font-bold text-white">1K+</span>
            </div>
            <span className="text-xs text-slate-500">Members</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-brand-400 mr-1.5" />
              <span className="text-2xl font-bold text-white">500+</span>
            </div>
            <span className="text-xs text-slate-500">Posts</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-brand-400 mr-1.5" />
              <span className="text-2xl font-bold text-white">10K+</span>
            </div>
            <span className="text-xs text-slate-500">Reactions</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Post Card Component ─────────────────────────────────────────────────────

function PostCard({
  post,
  onLike,
}: {
  post: Post;
  onLike: (id: string) => void;
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:translate-y-[-2px] animate-fade-in ${
        post.pinned ? "ring-1 ring-brand-500/30" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(
              post.author
            )} text-sm font-bold text-white shadow-lg`}
          >
            {post.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {post.author}
              </span>
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                  <Flame className="h-2.5 w-2.5" /> Pinned
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {formatTime(post.createdAt)}
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            CATEGORY_COLORS[post.category] || CATEGORY_COLORS["Off-Topic"]
          }`}
        >
          <Tag className="h-2.5 w-2.5" />
          {post.category}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-3 border-t border-surface-300/50">
        <button
          onClick={() => onLike(post.id)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            post.liked
              ? "bg-rose-500/20 text-rose-400"
              : "bg-surface-200 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${post.liked ? "fill-current" : ""}`}
          />
          {post.likes}
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-200 px-3 py-1.5 text-xs font-semibold text-slate-400">
          <MessageSquare className="h-3.5 w-3.5" />
          {post.comments}
        </span>
      </div>
    </div>
  );
}

// ─── Create Post Form ────────────────────────────────────────────────────────

function CreatePostForm({ onSubmit }: { onSubmit: (post: Post) => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Discussion");
  const [authorName, setAuthorName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const name = authorName.trim() || "Anonymous";
    onSubmit({
      id: generateId(),
      author: name,
      avatar: name.charAt(0).toUpperCase(),
      title: title.trim(),
      content: content.trim(),
      category,
      likes: 0,
      liked: false,
      comments: 0,
      createdAt: new Date(),
    });

    setTitle("");
    setContent("");
    setCategory("Discussion");
  };

  return (
    <div id="create" className="glass-card rounded-2xl overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-surface-200/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/20">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create a Post</h2>
            <p className="text-xs text-slate-500">
              Share your thoughts with the community
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {/* Form */}
      {isExpanded && (
        <form
          onSubmit={handleSubmit}
          className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4 animate-slide-down"
        >
          {/* Author Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Anonymous"
                className="w-full rounded-xl border border-surface-400/50 bg-surface-100 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              required
              className="w-full rounded-xl border border-surface-400/50 bg-surface-100 py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-colors"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your thoughts..."
              required
              rows={4}
              className="w-full rounded-xl border border-surface-400/50 bg-surface-100 py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-colors resize-none"
            />
          </div>

          {/* Category + Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-surface-400/50 bg-surface-100 py-2.5 px-4 text-sm text-white focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-colors appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all hover:shadow-brand-600/40 hover:-translate-y-0.5 hover:from-brand-500 hover:to-brand-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                disabled={!title.trim() || !content.trim()}
              >
                <Send className="h-4 w-4" />
                Post
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Post Feed Component ─────────────────────────────────────────────────────

function PostFeed({
  posts,
  onLike,
  activeFilter,
  onFilterChange,
}: {
  posts: Post[];
  onLike: (id: string) => void;
  activeFilter: string;
  onFilterChange: (cat: string) => void;
}) {
  return (
    <div id="posts">
      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onFilterChange("All")}
          className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeFilter === "All"
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
              : "bg-surface-200 text-slate-400 hover:text-white hover:bg-surface-300"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === cat
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                : "bg-surface-200 text-slate-400 hover:text-white hover:bg-surface-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              No posts yet
            </h3>
            <p className="text-sm text-slate-500">
              Be the first to create a post and start the conversation!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={onLike} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Footer Component ────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="mt-20 border-t border-surface-300/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Amahlao-Hub</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a
              href="#posts"
              className="hover:text-white transition-colors"
            >
              Posts
            </a>
            <a
              href="#create"
              className="hover:text-white transition-colors"
            >
              Create
            </a>
            <a
              href="https://discord.gg/S89f2Mzt6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#5865F2] transition-colors"
            >
              <DiscordLogo className="h-4 w-4" />
              Discord
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Amahlao-Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleNewPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const handleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const filteredPosts =
    activeFilter === "All"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  // Sort: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <Hero />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Posts */}
          <div className="lg:col-span-2">
            <PostFeed
              posts={sortedPosts}
              onLike={handleLike}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Create Post Card */}
            <CreatePostForm onSubmit={handleNewPost} />

            {/* Discord Card */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5865F2]/20">
                  <DiscordLogo className="h-5 w-5 text-[#5865F2]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Join Our Discord
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chat with the community
                  </p>
                </div>
              </div>
              <a
                href="https://discord.gg/S89f2Mzt6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#5865F2]/25 transition-all hover:bg-[#4752C4] hover:shadow-[#5865F2]/40 hover:-translate-y-0.5"
              >
                <DiscordLogo className="h-4 w-4" />
                Join Server
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-brand-400" />
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  Be respectful to all members
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  No spam or self-promotion
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  Stay on topic in discussions
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  Report inappropriate content
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  Have fun and be creative!
                </li>
              </ul>
            </div>

            {/* Categories Card */}
            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-400" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-all ${
                      activeFilter === cat
                        ? CATEGORY_COLORS[cat]
                        : "bg-surface-200 text-slate-500 border-transparent hover:text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
