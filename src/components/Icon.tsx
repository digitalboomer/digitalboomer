import React from 'react';
import {
  ArrowLeft, ArrowRight, Award, BadgeCheck, Bookmark, BookmarkCheck, BookOpen, Bot, Brain, CheckCheck, Check,
  CheckCircle2, CircleAlert, CircleHelp, CircleStop, CirclePlay, CircleUserRound, Clock, Contrast, Copy, Download,
  ExternalLink, Eye, EyeOff, Fish, Globe, GraduationCap, Heart, House, Info, KeyRound, Keyboard, LayoutGrid, Library,
  Lightbulb, Link, ListChecks, Loader2, Lock, LockOpen, Mail, MailCheck, Menu, Moon, Palette, PartyPopper, Printer,
  QrCode, ScanLine, Search, SearchX, Send, Shield, ShieldCheck, ShoppingBag, Smartphone, Sun, TrendingUp, Type,
  Volume2, X, RotateCcw, TriangleAlert, Trash2, Languages, ChevronDown, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  account_circle: CircleUserRound, arrow_back: ArrowLeft, arrow_forward: ArrowRight, bookmark: BookmarkCheck,
  bookmark_border: Bookmark, category: LayoutGrid, celebration: PartyPopper, check: Check, check_circle: CheckCircle2,
  checklist: ListChecks, close: X, content_copy: Copy, contrast: Contrast, crop_free: ScanLine, dark_mode: Moon,
  done_all: CheckCheck, download: Download, error: CircleAlert, favorite: Heart, format_size: Type, grid_view: LayoutGrid,
  help: CircleHelp, home: House, info: Info, key: KeyRound, keyboard: Keyboard, library_books: Library,
  light_mode: Sun, lightbulb: Lightbulb, link: Link, lock: Lock, lock_open: LockOpen, mail: Mail,
  mark_email_read: MailCheck, menu: Menu, menu_book: BookOpen, open_in_new: ExternalLink, palette: Palette,
  phishing: Fish, play_circle: CirclePlay, print: Printer, progress_activity: Loader2, psychology: Brain, public: Globe,
  qr_code_2: QrCode, report: CircleAlert, schedule: Clock, school: GraduationCap, search: Search, search_off: SearchX,
  security: ShieldCheck, send: Send, shield: Shield, shopping_bag: ShoppingBag, smart_toy: Bot, smartphone: Smartphone,
  stop_circle: CircleStop, task_alt: CheckCircle2, trending_up: TrendingUp, verified: BadgeCheck,
  verified_user: ShieldCheck, visibility: Eye, visibility_off: EyeOff, volume_up: Volume2, award: Award,
  restart_alt: RotateCcw, warning: TriangleAlert, delete: Trash2, translate: Languages, expand_more: ChevronDown,
};

/** Decorative icon. It takes its size from the text size class, and always sits next to a word or an accessible label. */
export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => {
  const Glyph = ICONS[name] ?? CircleHelp;
  return <Glyph aria-hidden="true" className={`ui-icon inline-block shrink-0 align-middle ${className}`} width="1em" height="1em" />;
};
