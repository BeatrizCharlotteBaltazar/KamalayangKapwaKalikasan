"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Megaphone,
  Calendar,
  Trees,
  BookOpen,
  Image as ImageIcon,
  Users,
  Heart,
  Mail,
  MessageSquare,
  Settings,
  Download,
  Trash2,
  Pencil,
  Plus,
  RotateCw,
  CheckCircle2,
  ShieldAlert,
  X,
  Upload,
  Globe,
  Check,
  Eye,
  LogOut,
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  QrCode,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/auth";
import { exportToCsv } from "@/lib/exportCsv";
import {
  PHILIPPINE_ENDANGERED_ANIMALS,
  EndangeredSpeciesPhoto,
  getDefaultWildlifePhoto,
} from "@/lib/wildlifePhotos";
import {
  verifyAdminClearance,
  fetchAdminLiveStats,
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
  fetchGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  fetchVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
  fetchDonations,
  updateDonationStatus,
  deleteDonation,
  fetchSubscribers,
  deleteSubscriber,
  fetchContactMessages,
  updateMessageStatus,
  deleteMessage,
  uploadMedia,
  AdminAnnouncement,
  AdminEvent,
  AdminProgram,
  AdminResource,
  AdminGalleryItem,
  AdminVolunteer,
  AdminDonation,
  AdminSubscriber,
  AdminContactMessage,
  AdminStats
} from "@/lib/supabase/adminStore";
import {
  fetchSiteSettings,
  updateSiteSettings,
  getStoredSiteSettings
} from "@/lib/siteSettings";
import { SiteSettings } from "@/types";

type AdminTab =
  | "posts"
  | "events"
  | "programs"
  | "resources"
  | "gallery"
  | "volunteers"
  | "donations"
  | "subscribers"
  | "messages"
  | "settings";

type PostModalType = "announcement" | "event" | "program" | "resource" | "gallery";

interface DeleteConfirmation {
  type: PostModalType | "volunteer" | "donation" | "subscriber" | "message";
  id: string;
  title: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("posts");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{
    id: string;
    role: string;
    fullName: string;
    email: string;
    avatarUrl: string;
  } | null>(null);

  // Live Stats
  const [stats, setStats] = useState<AdminStats>({
    announcementsCount: 0,
    eventsCount: 0,
    programsCount: 0,
    resourcesCount: 0,
    galleryCount: 0,
    volunteersCount: 0,
    donationsCount: 0,
    pendingDonationsCount: 0,
    subscribersCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
  });

  // Table Data States
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [galleryItems, setGalleryItems] = useState<AdminGalleryItem[]>([]);
  const [volunteers, setVolunteers] = useState<AdminVolunteer[]>([]);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(() => getStoredSiteSettings());

  // UI States
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation | null>(null);
  const [isPending, startTransition] = useTransition();

  // Unified Post/Edit Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalType, setPostModalType] = useState<PostModalType>("announcement");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [postModalError, setPostModalError] = useState<string | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Urgent Mobilization");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formLocation, setFormLocation] = useState("Tanay, Rizal");
  const [formDate, setFormDate] = useState("November 21, 2026");
  const [formTime, setFormTime] = useState("7:00 AM - 1:00 PM");
  const [formTargetVolunteers, setFormTargetVolunteers] = useState(150);
  const [formEventType, setFormEventType] = useState<AdminEvent["type"]>("Tree Growing");
  const [formResourceFormat, setFormResourceFormat] = useState<AdminResource["format"]>("PDF Document");
  const [formDownloadUrl, setFormDownloadUrl] = useState("/resources/guide.pdf");
  const [formFileSize, setFormFileSize] = useState("3.5 MB");
  const [formTags, setFormTags] = useState("Sierra Madre, Conservation");
  const [formAlbum, setFormAlbum] = useState("Tree Planting");
  const [formBeneficiaries, setFormBeneficiaries] = useState("Dumagat Ancestral Domain");
  const [formProgramStatus, setFormProgramStatus] = useState<AdminProgram["status"]>("ongoing");
  const [formPinned, setFormPinned] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [publishToMain, setPublishToMain] = useState(true);
  const [publishToMembers, setPublishToMembers] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState<string>(() => getDefaultWildlifePhoto().url);
  const [selectedAnimal, setSelectedAnimal] = useState<EndangeredSpeciesPhoto>(() => getDefaultWildlifePhoto());
  const [showWildlifePicker, setShowWildlifePicker] = useState(false);

  // Settings Feedback
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // 1. Strict Auth Verification (profiles.role ONLY)
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      setIsCheckingAuth(true);
      const res = await verifyAdminClearance();
      if (!isMounted) return;

      if (res.isAdmin && res.profile) {
        setIsAdmin(true);
        setAdminProfile(res.profile);
        loadDashboardData();
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setIsCheckingAuth(false);
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load all dashboard tables & live stats from Supabase
  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [
        liveStats,
        annList,
        evList,
        progList,
        resList,
        galList,
        volList,
        donList,
        subList,
        msgList,
        settingsData
      ] = await Promise.all([
        fetchAdminLiveStats(),
        fetchAnnouncements(),
        fetchEvents(),
        fetchPrograms(),
        fetchResources(),
        fetchGalleryItems(),
        fetchVolunteers(),
        fetchDonations(),
        fetchSubscribers(),
        fetchContactMessages(),
        fetchSiteSettings()
      ]);

      setStats(liveStats);
      setAnnouncements(annList);
      setEvents(evList);
      setPrograms(progList);
      setResources(resList);
      setGalleryItems(galList);
      setVolunteers(volList);
      setDonations(donList);
      setSubscribers(subList);
      setMessages(msgList);
      setSiteSettingsForm(settingsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Re-fetch counts
  const refreshStatsOnly = async () => {
    const updatedStats = await fetchAdminLiveStats();
    setStats(updatedStats);
  };

  // --- CSV EXPORT HANDLERS ---
  const handleExportVolunteers = () => {
    const headers = ["ID", "Full Name", "Email", "Phone", "Location", "Program", "Status", "Created At"];
    const rows = volunteers.map((v) => [
      v.id,
      v.fullName,
      v.email,
      v.phone,
      v.location || "",
      v.program,
      v.status,
      new Date(v.createdAt).toLocaleDateString(),
    ]);
    exportToCsv(`volunteers_${new Date().toISOString().slice(0, 10)}`, headers, rows);
    showFeedback("Volunteers roster exported to CSV successfully!");
  };

  const handleExportDonations = () => {
    const headers = ["ID", "Donor Name", "Email", "Amount (PHP)", "Trees Funded", "Payment Method", "Reference No", "Status", "Date"];
    const rows = donations.map((d) => [
      d.id,
      d.donorName,
      d.email,
      d.amount,
      d.trees,
      d.paymentMethod,
      d.referenceNo,
      d.status,
      new Date(d.createdAt).toLocaleDateString(),
    ]);
    exportToCsv(`donations_ledger_${new Date().toISOString().slice(0, 10)}`, headers, rows);
    showFeedback("Donations ledger exported to CSV successfully!");
  };

  const handleExportSubscribers = () => {
    const headers = ["ID", "Email Address", "Status", "Subscribed Date"];
    const rows = subscribers.map((s) => [
      s.id,
      s.email,
      s.status,
      new Date(s.createdAt).toLocaleDateString(),
    ]);
    exportToCsv(`subscribers_${new Date().toISOString().slice(0, 10)}`, headers, rows);
    showFeedback("Subscribers list exported to CSV successfully!");
  };

  // --- QUICK DRAFT/PUBLISHED TOGGLES ---
  const handleTogglePublishAnnouncement = async (item: AdminAnnouncement) => {
    const newStatus = !item.isPublished;
    setErrorMessage(null);
    try {
      await updateAnnouncement(item.id, { isPublished: newStatus });
      setAnnouncements(await fetchAnnouncements());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback(`Post ${newStatus ? "published live" : "moved to drafts"}.`);
    } catch (err: any) {
      setErrorMessage(`Failed to update post status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  const handleTogglePublishEvent = async (item: AdminEvent) => {
    const newStatus = !item.isPublished;
    setErrorMessage(null);
    try {
      await updateEvent(item.id, { isPublished: newStatus });
      setEvents(await fetchEvents());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback(`Event ${newStatus ? "published live" : "moved to drafts"}.`);
    } catch (err: any) {
      setErrorMessage(`Failed to update event status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  const handleTogglePublishProgram = async (item: AdminProgram) => {
    const newStatus = !item.isPublished;
    setErrorMessage(null);
    try {
      await updateProgram(item.id, { isPublished: newStatus });
      setPrograms(await fetchPrograms());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback(`Program ${newStatus ? "published live" : "moved to drafts"}.`);
    } catch (err: any) {
      setErrorMessage(`Failed to update program status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  const handleTogglePublishResource = async (item: AdminResource) => {
    const newStatus = !item.isPublished;
    setErrorMessage(null);
    try {
      await updateResource(item.id, { isPublished: newStatus });
      setResources(await fetchResources());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback(`Resource ${newStatus ? "published live" : "moved to drafts"}.`);
    } catch (err: any) {
      setErrorMessage(`Failed to update resource status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  const handleTogglePublishGallery = async (item: AdminGalleryItem) => {
    const newStatus = !item.isPublished;
    setErrorMessage(null);
    try {
      await updateGalleryItem(item.id, { isPublished: newStatus });
      setGalleryItems(await fetchGalleryItems());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback(`Gallery photo ${newStatus ? "published live" : "moved to drafts"}.`);
    } catch (err: any) {
      setErrorMessage(`Failed to update gallery photo status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  // --- DONATIONS VERIFY & REJECT ---
  const handleVerifyDonationAction = async (id: string) => {
    setErrorMessage(null);
    try {
      await updateDonationStatus(id, "Verified");
      setDonations(await fetchDonations());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback("Donation marked as Verified in database!");
    } catch (err: any) {
      setErrorMessage(`Failed to verify donation in Supabase: ${err?.message || "Database error"}`);
    }
  };

  const handleRejectDonationAction = async (id: string) => {
    setErrorMessage(null);
    try {
      await updateDonationStatus(id, "Rejected");
      setDonations(await fetchDonations());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback("Donation marked as Rejected in database.");
    } catch (err: any) {
      setErrorMessage(`Failed to reject donation in Supabase: ${err?.message || "Database error"}`);
    }
  };

  // --- VOLUNTEER ACTIONS ---
  const handleApproveVolunteerAction = async (id: string) => {
    setErrorMessage(null);
    try {
      await updateVolunteerStatus(id, "Approved");
      setVolunteers(await fetchVolunteers());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback("Volunteer approved in database!");
    } catch (err: any) {
      setErrorMessage(`Failed to approve volunteer in Supabase: ${err?.message || "Database error"}`);
    }
  };

  const handleRejectVolunteerAction = async (id: string) => {
    setErrorMessage(null);
    try {
      await updateVolunteerStatus(id, "Rejected");
      setVolunteers(await fetchVolunteers());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback("Volunteer status updated to Rejected.");
    } catch (err: any) {
      setErrorMessage(`Failed to update volunteer status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  // --- MESSAGES ACTIONS ---
  const handleToggleMessageStatus = async (msg: AdminContactMessage, nextStatus: AdminContactMessage["status"]) => {
    setErrorMessage(null);
    try {
      await updateMessageStatus(msg.id, nextStatus);
      setMessages(await fetchContactMessages());
      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback(`Message marked as ${nextStatus} in database.`);
    } catch (err: any) {
      setErrorMessage(`Failed to update message status in Supabase: ${err?.message || "Database error"}`);
    }
  };

  // --- CONFIRMED DELETION ---
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setErrorMessage(null);

    try {
      switch (type) {
        case "announcement":
          await deleteAnnouncement(id);
          setAnnouncements(await fetchAnnouncements());
          break;
        case "event":
          await deleteEvent(id);
          setEvents(await fetchEvents());
          break;
        case "program":
          await deleteProgram(id);
          setPrograms(await fetchPrograms());
          break;
        case "resource":
          await deleteResource(id);
          setResources(await fetchResources());
          break;
        case "gallery":
          await deleteGalleryItem(id);
          setGalleryItems(await fetchGalleryItems());
          break;
        case "volunteer":
          await deleteVolunteer(id);
          setVolunteers(await fetchVolunteers());
          break;
        case "donation":
          await deleteDonation(id);
          setDonations(await fetchDonations());
          break;
        case "subscriber":
          await deleteSubscriber(id);
          setSubscribers(await fetchSubscribers());
          break;
        case "message":
          await deleteMessage(id);
          setMessages(await fetchContactMessages());
          break;
      }

      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      showFeedback("Item permanently deleted from database.");
    } catch (err: any) {
      setErrorMessage(`Failed to delete item from Supabase: ${err?.message || "Database error"}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  // --- OPEN CREATE/EDIT MODAL ---
  const openCreateModal = (type: PostModalType = "announcement") => {
    setEditingItemId(null);
    setPostModalType(type);
    setPostModalError(null);
    setIsSavingPost(false);
    setFormTitle("");
    setFormCategory("Urgent Mobilization");
    setFormSummary("");
    setFormContent("");
    setFormLocation("Tanay, Rizal");
    setFormDate("November 21, 2026");
    setFormTime("7:00 AM - 1:00 PM");
    setFormTargetVolunteers(150);
    setFormEventType("Tree Growing");
    setFormResourceFormat("PDF Document");
    setFormDownloadUrl("/resources/guide.pdf");
    setFormFileSize("3.5 MB");
    setFormTags("Sierra Madre, Conservation");
    setFormAlbum("Tree Planting");
    setFormBeneficiaries("Dumagat Ancestral Domain");
    setFormProgramStatus("ongoing");
    setFormPinned(false);
    setFormIsPublished(true);
    setPublishToMain(true);
    setPublishToMembers(true);

    const defaultWildlife = getDefaultWildlifePhoto();
    setSelectedAnimal(defaultWildlife);
    setFormImageUrl(defaultWildlife.url);
    setShowWildlifePicker(false);
    setIsPostModalOpen(true);
  };

  const openEditModal = (type: PostModalType, item: any) => {
    setEditingItemId(item.id);
    setPostModalType(type);
    setPostModalError(null);
    setIsSavingPost(false);
    setFormTitle(item.title || item.caption || "");
    setFormCategory(item.category || "General");
    setFormSummary(item.excerpt || item.description || "");
    setFormContent(item.content || item.detailedContent || item.description || item.caption || "");
    setFormLocation(item.location || "Tanay, Rizal");
    setFormDate(item.date || "Upcoming");
    setFormTime(item.time || "8:00 AM");
    setFormTargetVolunteers(item.targetVolunteers || 150);
    setFormEventType(item.type || "Tree Growing");
    setFormResourceFormat(item.format || "PDF Document");
    setFormDownloadUrl(item.downloadUrl || "/resources/guide.pdf");
    setFormFileSize(item.fileSize || "3.5 MB");
    setFormTags((item.tags || []).join(", "));
    setFormAlbum(item.album || "Tree Planting");
    setFormBeneficiaries(item.beneficiaries || "Dumagat Ancestral Domain");
    setFormProgramStatus(item.status || "ongoing");
    setFormPinned(!!item.pinned);
    setFormIsPublished(item.isPublished !== false);
    setPublishToMain(item.publishToMain !== false);
    setPublishToMembers(item.publishToMembers !== false);

    const initialImg = item.imageUrl || item.coverImage || item.mediaUrl || getDefaultWildlifePhoto().url;
    setFormImageUrl(initialImg);

    const matchedAnimal = PHILIPPINE_ENDANGERED_ANIMALS.find(
      (a) => a.id === item.animalSpeciesId || a.url === initialImg
    ) || getDefaultWildlifePhoto();
    setSelectedAnimal(matchedAnimal);

    setShowWildlifePicker(false);
    setIsPostModalOpen(true);
  };

  // --- SAVE POST (CREATE OR EDIT) ---
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSavingPost(true);
    setPostModalError(null);

    const currentAuthor = adminProfile?.fullName || "Jennifer Gutierrez Baltazar";
    const currentRole = adminProfile?.role === "admin" ? "Executive Director" : "Eco-Steward";

    const matchedAnimal = PHILIPPINE_ENDANGERED_ANIMALS.find(
      (a) => a.url === formImageUrl || a.id === selectedAnimal.id
    );
    const finalSpeciesId = matchedAnimal ? matchedAnimal.id : undefined;
    const finalSpeciesName = matchedAnimal ? matchedAnimal.name : undefined;

    try {
      if (editingItemId) {
        // EDIT MODE
        switch (postModalType) {
          case "announcement":
            await updateAnnouncement(editingItemId, {
              title: formTitle.trim(),
              category: formCategory as AdminAnnouncement["category"],
              excerpt: formSummary.trim() || formContent.slice(0, 140) + "...",
              content: formContent.trim(),
              imageUrl: formImageUrl,
              animalSpeciesId: finalSpeciesId,
              animalSpeciesName: finalSpeciesName,
              pinned: formPinned,
              isPublished: formIsPublished,
              publishToMain,
              publishToMembers,
            });
            setAnnouncements(await fetchAnnouncements());
            showFeedback("Post updated successfully in Supabase!");
            break;

          case "event":
            await updateEvent(editingItemId, {
              title: formTitle.trim(),
              type: formEventType,
              location: formLocation.trim() || "Sierra Madre",
              date: formDate.trim() || "Upcoming",
              time: formTime.trim() || "8:00 AM",
              description: formContent.trim(),
              targetVolunteers: Number(formTargetVolunteers) || 100,
              imageUrl: formImageUrl,
              animalSpeciesId: finalSpeciesId,
              animalSpeciesName: finalSpeciesName,
              isPublished: formIsPublished,
              status: formIsPublished
                ? (formDate && !isNaN(Date.parse(formDate)) && new Date(formDate).getTime() > Date.now()
                    ? "upcoming"
                    : "published")
                : "draft",
              publishToMain,
              publishToMembers,
            });
            setEvents(await fetchEvents());
            showFeedback("Event updated successfully in Supabase!");
            break;

          case "program":
            await updateProgram(editingItemId, {
              title: formTitle.trim(),
              category: formCategory,
              description: formSummary.trim() || formContent.slice(0, 160),
              detailedContent: formContent.trim(),
              location: formLocation.trim(),
              beneficiaries: formBeneficiaries.trim(),
              status: formProgramStatus,
              coverImage: formImageUrl,
              isPublished: formIsPublished,
            });
            setPrograms(await fetchPrograms());
            showFeedback("Program updated successfully in Supabase!");
            break;

          case "resource": {
            const parsedTags = formTags.split(",").map((t) => t.trim()).filter(Boolean);
            await updateResource(editingItemId, {
              title: formTitle.trim(),
              category: formCategory as AdminResource["category"],
              format: formResourceFormat,
              description: formContent.trim(),
              downloadUrl: formDownloadUrl.trim() || "/resources/guide.pdf",
              fileSize: formFileSize.trim() || "3.5 MB",
              tags: parsedTags,
              imageUrl: formImageUrl,
              isPublished: formIsPublished,
            });
            setResources(await fetchResources());
            showFeedback("Resource guide updated successfully in Supabase!");
            break;
          }

          case "gallery":
            await updateGalleryItem(editingItemId, {
              title: formTitle.trim(),
              caption: formContent.trim() || formTitle.trim(),
              album: formAlbum,
              mediaUrl: formImageUrl,
              mediaType: "image",
              location: formLocation.trim(),
              date: formDate.trim(),
              isPublished: formIsPublished,
            });
            setGalleryItems(await fetchGalleryItems());
            showFeedback("Gallery photo updated successfully in Supabase!");
            break;
        }
      } else {
        // CREATE MODE
        switch (postModalType) {
          case "announcement":
            await createAnnouncement({
              title: formTitle.trim(),
              category: formCategory as AdminAnnouncement["category"],
              excerpt: formSummary.trim() || formContent.slice(0, 140) + "...",
              content: formContent.trim(),
              author: currentAuthor,
              authorRole: currentRole,
              authorAvatar: adminProfile?.avatarUrl,
              imageUrl: formImageUrl,
              animalSpeciesId: finalSpeciesId,
              animalSpeciesName: finalSpeciesName,
              pinned: formPinned,
              isPublished: formIsPublished,
              publishToMain,
              publishToMembers,
            });
            setAnnouncements(await fetchAnnouncements());
            showFeedback("Post published successfully in Supabase!");
            break;

          case "event":
            await createEvent({
              title: formTitle.trim(),
              type: formEventType,
              location: formLocation.trim() || "Tanay, Rizal",
              date: formDate.trim() || "Upcoming",
              time: formTime.trim() || "7:00 AM - 1:00 PM",
              description: formContent.trim(),
              targetVolunteers: Number(formTargetVolunteers) || 100,
              status: formIsPublished
                ? (formDate && !isNaN(Date.parse(formDate)) && new Date(formDate).getTime() > Date.now()
                    ? "upcoming"
                    : "published")
                : "draft",
              imageUrl: formImageUrl,
              animalSpeciesId: finalSpeciesId,
              animalSpeciesName: finalSpeciesName,
              isPublished: formIsPublished,
              publishToMain,
              publishToMembers,
            });
            setEvents(await fetchEvents());
            showFeedback("Event scheduled successfully in Supabase!");
            break;

          case "program":
            await createProgram({
              title: formTitle.trim(),
              category: formCategory || "Forestry & Reforestation",
              description: formSummary.trim() || formContent.slice(0, 160),
              detailedContent: formContent.trim(),
              location: formLocation.trim() || "Sierra Madre",
              beneficiaries: formBeneficiaries.trim() || "Indigenous Partners",
              status: formProgramStatus,
              coverImage: formImageUrl,
              isPublished: formIsPublished,
            });
            setPrograms(await fetchPrograms());
            showFeedback("Program added successfully in Supabase!");
            break;

          case "resource": {
            const parsedTags = formTags.split(",").map((t) => t.trim()).filter(Boolean);
            await createResource({
              title: formTitle.trim(),
              category: formCategory as AdminResource["category"],
              format: formResourceFormat,
              description: formContent.trim(),
              downloadUrl: formDownloadUrl.trim() || "/resources/guide.pdf",
              fileSize: formFileSize.trim() || "3.5 MB",
              tags: parsedTags,
              imageUrl: formImageUrl,
              isPublished: formIsPublished,
            });
            setResources(await fetchResources());
            showFeedback("Resource added to Knowledge Hub in Supabase!");
            break;
          }

          case "gallery":
            await createGalleryItem({
              title: formTitle.trim(),
              caption: formContent.trim() || formTitle.trim(),
              album: formAlbum,
              mediaUrl: formImageUrl,
              mediaType: "image",
              location: formLocation.trim() || "Sierra Madre",
              date: formDate.trim() || "2026",
              isPublished: formIsPublished,
            });
            setGalleryItems(await fetchGalleryItems());
            showFeedback("Photo added to Gallery in Supabase!");
            break;
        }
      }

      refreshStatsOnly();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kkk_content_updated"));
        window.dispatchEvent(new Event("storage"));
      }
      setIsPostModalOpen(false);
      setEditingItemId(null);
    } catch (err: any) {
      console.error("Save post error:", err);
      setPostModalError(err?.message || "Failed to save item to Supabase database. Please check your connection or table schema.");
    } finally {
      setIsSavingPost(false);
    }
  };

  // --- SAVE SITE SETTINGS ---
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setErrorMessage(null);
    try {
      const res = await updateSiteSettings(siteSettingsForm);
      if (res.success) {
        const fresh = await fetchSiteSettings();
        setSiteSettingsForm(fresh);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("kkk_content_updated"));
          window.dispatchEvent(new Event("storage"));
        }
        showFeedback("Site settings saved in Supabase! Donate and Contact pages updated.");
      } else {
        setErrorMessage(`Failed to save site settings to Supabase: ${res.error || "Database error"}`);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to save site settings: ${err?.message || "Unknown error"}`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // -------------------------------------------------------------
  // RENDERING
  // -------------------------------------------------------------

  // Checking Auth State
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col relative min-h-screen items-center justify-center text-white">
        <div className="fixed inset-0 -z-30 pointer-events-none select-none">
          <Image
            src="/images/bg2.jpg"
            alt="Sierra Madre Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/85 via-[#07160c]/80 to-[#040e06]/95" />
        </div>
        <div className="text-center space-y-4 p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl max-w-md mx-4">
          <RotateCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <h2 className="font-heading font-bold text-lg text-white">
            Checking Admin Clearance
          </h2>
          <p className="text-xs text-slate-300">
            Verifying your role in the profiles table...
          </p>
        </div>
      </div>
    );
  }

  // Not Admin Clearance Screen (Strict profiles.role enforcement)
  if (!isAdmin) {
    return (
      <div className="flex flex-col relative min-h-screen items-center justify-center text-white p-4">
        <div className="fixed inset-0 -z-30 pointer-events-none select-none">
          <Image
            src="/images/bg2.jpg"
            alt="Sierra Madre Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/85 via-[#07160c]/80 to-[#040e06]/95" />
        </div>

        <div className="max-w-lg w-full p-8 rounded-3xl bg-[#0A1B11]/90 backdrop-blur-xl border border-amber-500/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              Access Restricted
            </span>
            <h1
              style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
              className="font-alice text-2xl sm:text-3xl font-normal uppercase tracking-tight"
            >
              Admin Access Required
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              This portal is restricted to organization administrators. Your authenticated profile does not have the <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300 font-mono">admin</code> role in the database <code className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300 font-mono">profiles</code> table.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors"
            >
              Log In as Admin
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pending Donations Count
  const pendingDonationsCount = donations.filter((d) => d.status === "Pending").length;
  const unreadMessagesCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="flex flex-col relative min-h-screen text-white">

      {/* Sticky Sierra Madre Background */}
      <div className="fixed inset-0 -z-30 pointer-events-none select-none">
        <Image
          src="/images/bg2.jpg"
          alt="Sierra Madre Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06110a]/85 via-[#07160c]/80 to-[#040e06]/95" />
      </div>

      {/* Admin Top Navigation Bar */}
      <header className="bg-[#1F1209]/80 backdrop-blur-md border-b border-[#4A2814]/40 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#8B5A2B]/60 bg-[#120A04] shadow-md group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                Kamalayang Kapwa Kalikasan
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/member/dashboard"
              className="text-emerald-300 hover:text-white hidden sm:inline-flex items-center gap-1 font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Member Portal</span>
            </Link>
            <Link
              href="/"
              className="text-slate-300 hover:text-white hidden sm:inline-flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Site</span>
            </Link>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="px-3 py-1.5 rounded-full bg-[#DC2626]/20 border border-[#DC2626]/40 text-red-300 hover:bg-[#DC2626]/40 hover:text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 relative z-10">

        {/* Feedback & Error Notifications */}
        {feedbackMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="text-emerald-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/95 border border-red-500/60 text-red-200 text-xs font-semibold flex items-start justify-between gap-3 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-100">Database Action Error</p>
                <p className="mt-0.5 text-red-300 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Banner with Single + Create Post Button */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0A1B11]/85 backdrop-blur-xl border border-emerald-500/25 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                Admin
              </span>
              <span className="text-xs text-slate-400">
                {adminProfile?.email}
              </span>
            </div>
            <h1
              style={{ fontFamily: 'var(--font-alice), "Alice", Georgia, serif', color: '#e1ffdd' }}
              className="font-alice text-2xl sm:text-3xl font-normal tracking-tight"
            >
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Manage organization posts, track volunteer rosters, verify donations, and update website settings.
            </p>
          </div>

          {/* Top Right: Single Create Post Button */}
          <div className="shrink-0 flex items-center gap-2">
            <Button
              onClick={() => openCreateModal("announcement")}
              className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-xl cursor-pointer flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Create Post</span>
            </Button>
          </div>
        </div>

        {/* Live Metrics Strip (Replaces hardcoded stats with live counts, removes static badge) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0A1B11]/70 border border-emerald-500/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">Posts:</span>
              <strong className="text-white font-bold">{announcements.length}</strong>
            </div>
            <div className="hidden sm:block text-white/20">&bull;</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-slate-400">Events:</span>
              <strong className="text-white font-bold">{events.length}</strong>
            </div>
            <div className="hidden sm:block text-white/20">&bull;</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span className="text-slate-400">Programs:</span>
              <strong className="text-white font-bold">{programs.length}</strong>
            </div>
            <div className="hidden sm:block text-white/20">&bull;</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-slate-400">Resources:</span>
              <strong className="text-white font-bold">{resources.length}</strong>
            </div>
            <div className="hidden sm:block text-white/20">&bull;</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">Volunteers:</span>
              <strong className="text-white font-bold">{volunteers.length}</strong>
            </div>
            <div className="hidden sm:block text-white/20">&bull;</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-slate-400">Donations:</span>
              <strong className="text-white font-bold">{donations.length}</strong>
            </div>
          </div>

          {/* Quick Refresh Button */}
          <button
            type="button"
            onClick={() => loadDashboardData()}
            disabled={isLoadingData}
            className="text-[11px] text-emerald-300 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10"
            title="Reload live database records"
          >
            <RotateCw className={`w-3 h-3 ${isLoadingData ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isLoadingData ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>

        {/* Tab Navigation (Plain labels with live counts & pending donation badge) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: "posts", label: "Posts", count: announcements.length, icon: Megaphone },
            { id: "events", label: "Events", count: events.length, icon: Calendar },
            { id: "programs", label: "Programs", count: programs.length, icon: Trees },
            { id: "resources", label: "Resources", count: resources.length, icon: BookOpen },
            { id: "gallery", label: "Gallery", count: galleryItems.length, icon: ImageIcon },
            { id: "volunteers", label: "Volunteers", count: volunteers.length, icon: Users },
            {
              id: "donations",
              label: "Donations",
              count: donations.length,
              pendingCount: pendingDonationsCount,
              icon: Heart
            },
            { id: "subscribers", label: "Subscribers", count: subscribers.length, icon: Mail },
            {
              id: "messages",
              label: "Messages",
              count: messages.length,
              unreadCount: unreadMessagesCount,
              icon: MessageSquare
            },
            { id: "settings", label: "Site Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#25150B] text-[#e1ffdd] border border-[#8B5A2B] shadow-lg scale-102"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#e1ffdd]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[11px] opacity-75 font-mono">({tab.count})</span>
                )}
                {/* Donations pending badge */}
                {tab.id === "donations" && tab.pendingCount !== undefined && tab.pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 animate-pulse">
                    {tab.pendingCount}
                  </span>
                )}
                {/* Unread messages badge */}
                {tab.id === "messages" && tab.unreadCount !== undefined && tab.unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950">
                    {tab.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: POSTS & ANNOUNCEMENTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "posts" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Posts & Announcements
                </h2>
                <p className="text-xs text-slate-300">
                  Broadcast mobilization calls and updates. Public published posts appear on the website and member news feed.
                </p>
              </div>
              <Button
                onClick={() => openCreateModal("announcement")}
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New Post</span>
              </Button>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-400">
                  No posts yet. Click the &ldquo;+ Create Post&rdquo; button above to publish.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0A1B11]/80 hover:bg-[#0A1B11]/95 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {ann.imageUrl ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                          <Image
                            src={ann.imageUrl}
                            alt={ann.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                          <Megaphone className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {ann.category}
                          </span>

                          {/* Quick Draft/Published Toggle Badge */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublishAnnouncement(ann)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                              ann.isPublished
                                ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-800"
                                : "bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700"
                            }`}
                            title="Click to toggle Published / Draft"
                          >
                            {ann.isPublished ? "● Published" : "○ Draft"}
                          </button>

                          {ann.publishToMain && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 text-[9px] font-bold border border-blue-500/30 flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" />
                              <span>Main Web</span>
                            </span>
                          )}
                          {ann.publishToMembers && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" />
                              <span>Members</span>
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                          {ann.title}
                        </h3>

                        <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
                          {ann.excerpt || ann.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditModal("announcement", ann)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit post"
                      >
                        <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: "announcement",
                            id: ann.id,
                            title: ann.title,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: EVENTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "events" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Events & Mobilizations
                </h2>
                <p className="text-xs text-slate-300">
                  Upcoming tree growing expeditions, coastal cleanups, and community environmental forums.
                </p>
              </div>
              <Button
                onClick={() => openCreateModal("event")}
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New Event</span>
              </Button>
            </div>

            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-400">
                  No events scheduled yet. Click the &ldquo;+ Create Post&rdquo; button above to schedule one.
                </div>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0A1B11]/80 hover:bg-[#0A1B11]/95 border border-blue-500/20 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {ev.imageUrl ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                          <Image
                            src={ev.imageUrl}
                            alt={ev.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                          <Calendar className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-500/40">
                            {ev.type}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleTogglePublishEvent(ev)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                              ev.isPublished
                                ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-800"
                                : "bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700"
                            }`}
                            title="Click to toggle Published / Draft"
                          >
                            {ev.isPublished ? "● Published" : "○ Draft"}
                          </button>

                          <span className="text-[10px] text-emerald-400 font-bold">
                            {ev.status}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                          {ev.title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
                          <span className="text-amber-300 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{ev.date} ({ev.time})</span>
                          </span>
                          <span className="text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{ev.location}</span>
                          </span>
                          <span className="text-slate-400">
                            Quota: <strong className="text-white">{ev.targetVolunteers}</strong> vols
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditModal("event", ev)}
                        className="px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit event"
                      >
                        <Pencil className="w-3.5 h-3.5 text-blue-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: "event",
                            id: ev.id,
                            title: ev.title,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PROGRAMS (NEW TAB) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "programs" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Conservation Programs
                </h2>
                <p className="text-xs text-slate-300">
                  Long-term environmental programs, reforestation projects, and indigenous community initiatives.
                </p>
              </div>
              <Button
                onClick={() => openCreateModal("program")}
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New Program</span>
              </Button>
            </div>

            <div className="space-y-3">
              {programs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-400">
                  No programs added yet. Click &ldquo;New Program&rdquo; to create one.
                </div>
              ) : (
                programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0A1B11]/80 hover:bg-[#0A1B11]/95 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {prog.coverImage ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                          <Image
                            src={prog.coverImage}
                            alt={prog.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                          <Trees className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {prog.category}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleTogglePublishProgram(prog)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                              prog.isPublished
                                ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-800"
                                : "bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700"
                            }`}
                            title="Click to toggle Published / Draft"
                          >
                            {prog.isPublished ? "● Published" : "○ Draft"}
                          </button>

                          <span className="text-[10px] uppercase font-bold text-amber-300">
                            Status: {prog.status}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                          {prog.title}
                        </h3>

                        <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
                          {prog.description}
                        </p>

                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          {prog.location && <span>Location: {prog.location}</span>}
                          {prog.beneficiaries && <span>&bull; Partners: {prog.beneficiaries}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditModal("program", prog)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit program"
                      >
                        <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: "program",
                            id: prog.id,
                            title: prog.title,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: RESOURCES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "resources" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Resources & Guides
                </h2>
                <p className="text-xs text-slate-300">
                  Downloadable forestry manuals, biodiversity field guides, and legal toolkits.
                </p>
              </div>
              <Button
                onClick={() => openCreateModal("resource")}
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>New Resource</span>
              </Button>
            </div>

            <div className="space-y-3">
              {resources.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-400">
                  No resources uploaded yet. Click &ldquo;New Resource&rdquo; to add.
                </div>
              ) : (
                resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0A1B11]/80 hover:bg-[#0A1B11]/95 border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {res.imageUrl ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                          <Image
                            src={res.imageUrl}
                            alt={res.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                            {res.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            {res.format} &bull; {res.fileSize || "3.5 MB"}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleTogglePublishResource(res)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                              res.isPublished
                                ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-800"
                                : "bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700"
                            }`}
                            title="Click to toggle Published / Draft"
                          >
                            {res.isPublished ? "● Published" : "○ Draft"}
                          </button>
                        </div>

                        <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                          {res.title}
                        </h3>

                        <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
                          {res.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditModal("resource", res)}
                        className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit resource"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: "resource",
                            id: res.id,
                            title: res.title,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: GALLERY (NEW TAB) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "gallery" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Photo & Media Gallery
                </h2>
                <p className="text-xs text-slate-300">
                  Community photos, tree planting documentations, and coastal rehabilitation media.
                </p>
              </div>
              <Button
                onClick={() => openCreateModal("gallery")}
                size="sm"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add Photo</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.length === 0 ? (
                <div className="col-span-full p-8 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-400">
                  No gallery items yet. Click &ldquo;Add Photo&rdquo; to upload.
                </div>
              ) : (
                galleryItems.map((gal) => (
                  <div
                    key={gal.id}
                    className="rounded-2xl overflow-hidden bg-[#0A1B11]/85 border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-black">
                      <Image
                        src={gal.mediaUrl}
                        alt={gal.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-sm text-emerald-300 border border-white/10">
                          {gal.album}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTogglePublishGallery(gal)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer backdrop-blur-sm ${
                            gal.isPublished
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-900/80 text-slate-400 border-slate-600"
                          }`}
                        >
                          {gal.isPublished ? "Published" : "Draft"}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
                          {gal.caption}
                        </p>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          {gal.location && <span>{gal.location}</span>}
                          {gal.date && <span>&bull; {gal.date}</span>}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => openEditModal("gallery", gal)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              type: "gallery",
                              id: gal.id,
                              title: gal.caption.slice(0, 30),
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-300 text-xs font-bold border border-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: VOLUNTEERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "volunteers" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Volunteers Roster ({volunteers.length})
                </h2>
                <p className="text-xs text-slate-300">
                  Applications from citizens and youth champions volunteering for reforestation and coastal drives.
                </p>
              </div>

              {/* CSV Export Button */}
              <Button
                onClick={handleExportVolunteers}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Export Volunteers (CSV)</span>
              </Button>
            </div>

            <div className="rounded-3xl overflow-hidden bg-[#0A1B11]/85 border border-emerald-500/25 shadow-2xl overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#12281B] text-[#D4C3A3] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Volunteer</th>
                    <th className="py-3.5 px-6">Contact Info</th>
                    <th className="py-3.5 px-6">Program</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {volunteers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                        No volunteer applications yet.
                      </td>
                    </tr>
                  ) : volunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <span className="block text-white font-bold">{v.fullName}</span>
                        {v.location && <span className="text-[10px] text-slate-400">{v.location}</span>}
                      </td>
                      <td className="py-4 px-6">
                        <span className="block text-slate-300">{v.email}</span>
                        <span className="text-xs text-slate-400">{v.phone}</span>
                      </td>
                      <td className="py-4 px-6 text-emerald-300 font-medium">
                        {v.program}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            v.status === "Approved"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                              : v.status === "Rejected"
                              ? "bg-red-950 text-red-400 border border-red-500/40"
                              : "bg-amber-950 text-amber-400 border border-amber-500/40"
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {v.status !== "Approved" && (
                            <Button
                              onClick={() => handleApproveVolunteerAction(v.id)}
                              size="sm"
                              className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl h-8 px-2.5"
                            >
                              Approve
                            </Button>
                          )}
                          {v.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleRejectVolunteerAction(v.id)}
                              className="px-2.5 py-1 rounded-xl bg-red-950/40 hover:bg-red-950 text-red-300 text-xs font-bold border border-red-500/30 transition-colors h-8"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                type: "volunteer",
                                id: v.id,
                                title: v.fullName,
                              })
                            }
                            className="p-1.5 rounded-xl hover:bg-red-950/40 text-slate-400 hover:text-red-300 transition-colors"
                            title="Delete volunteer record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: DONATIONS LEDGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "donations" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                    Donations Ledger ({donations.length})
                  </h2>
                  {pendingDonationsCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                      {pendingDonationsCount} Pending Verification
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  Review submitted GCash and Bank transfer reference numbers, verify proofs, and track trees planted.
                </p>
              </div>

              {/* CSV Export Button */}
              <Button
                onClick={handleExportDonations}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Export Donations (CSV)</span>
              </Button>
            </div>

            <div className="rounded-3xl overflow-hidden bg-[#0A1B11]/85 border border-emerald-500/25 shadow-2xl overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#12281B] text-[#D4C3A3] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Donor</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Trees</th>
                    <th className="py-3.5 px-6">Channel & Ref No</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                        No donations recorded yet.
                      </td>
                    </tr>
                  ) : donations.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">
                        <span>{d.donorName}</span>
                        <span className="block text-[11px] text-slate-400 font-normal">{d.email}</span>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-base text-white">
                        ₱{Number(d.amount).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-emerald-300 font-bold">
                        {d.trees} Trees
                      </td>
                      <td className="py-4 px-6 font-mono text-xs">
                        <span className="block text-slate-300 font-semibold">{d.paymentMethod}</span>
                        <span className="text-[11px] text-slate-400">{d.referenceNo}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            d.status === "Verified"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                              : d.status === "Rejected"
                              ? "bg-red-950 text-red-400 border border-red-500/40"
                              : "bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {d.status !== "Verified" && (
                            <Button
                              onClick={() => handleVerifyDonationAction(d.id)}
                              size="sm"
                              className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-bold text-xs rounded-xl h-8 px-2.5"
                            >
                              Verify
                            </Button>
                          )}
                          {d.status !== "Rejected" && (
                            <button
                              type="button"
                              onClick={() => handleRejectDonationAction(d.id)}
                              className="px-2.5 py-1 rounded-xl bg-red-950/40 hover:bg-red-950 text-red-300 text-xs font-bold border border-red-500/30 transition-colors h-8"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                type: "donation",
                                id: d.id,
                                title: `Donation by ${d.donorName}`,
                              })
                            }
                            className="p-1.5 rounded-xl hover:bg-red-950/40 text-slate-400 hover:text-red-300 transition-colors"
                            title="Delete donation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: SUBSCRIBERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "subscribers" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Subscribers ({subscribers.length})
                </h2>
                <p className="text-xs text-slate-300">
                  Community email subscribers receiving environmental news briefs and urgent mobilization alerts.
                </p>
              </div>

              {/* CSV Export Button */}
              <Button
                onClick={handleExportSubscribers}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Export Subscribers (CSV)</span>
              </Button>
            </div>

            <div className="rounded-3xl overflow-hidden bg-[#0A1B11]/85 border border-emerald-500/25 shadow-2xl overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#12281B] text-[#D4C3A3] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Subscribed Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-xs text-slate-400">
                        No subscribers yet.
                      </td>
                    </tr>
                  ) : subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{s.email}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              type: "subscriber",
                              id: s.id,
                              title: s.email,
                            })
                          }
                          className="p-1.5 rounded-xl hover:bg-red-950/40 text-slate-400 hover:text-red-300 transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 9: MESSAGES (contact_messages) (NEW TAB) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "messages" && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Messages & Inquiries ({messages.length})
                </h2>
                <p className="text-xs text-slate-300">
                  Inquiries submitted via the public Contact page.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-slate-400">
                  No messages yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl bg-[#0A1B11]/80 hover:bg-[#0A1B11]/95 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-white text-sm sm:text-base font-bold">{msg.name}</strong>
                        <span className="text-xs text-slate-400">&bull; {msg.email}</span>
                        {msg.phone && <span className="text-xs text-slate-400">&bull; {msg.phone}</span>}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            msg.status === "Unread"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                              : msg.status === "Resolved"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : "bg-slate-800 text-slate-300 border border-slate-600"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-emerald-300">{msg.subject}</h4>
                      <p className="text-xs text-slate-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {msg.status !== "Read" && (
                          <button
                            type="button"
                            onClick={() => handleToggleMessageStatus(msg, "Read")}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                          >
                            Mark Read
                          </button>
                        )}
                        {msg.status !== "Resolved" && (
                          <button
                            type="button"
                            onClick={() => handleToggleMessageStatus(msg, "Resolved")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-xs font-bold border border-emerald-500/40"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              type: "message",
                              id: msg.id,
                              title: `Message from ${msg.name}`,
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-red-950/40 text-slate-400 hover:text-red-300"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 10: SITE SETTINGS (NEW TAB) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "settings" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                Website & Donation Settings
              </h2>
              <p className="text-xs text-slate-300">
                Update the official GCash account, bank transfer details, and organization contact info displayed on the Donate and Contact pages.
              </p>
            </div>

            <form onSubmit={handleSaveSiteSettings} className="space-y-6">
              {/* GCash Settings Section */}
              <div className="p-6 rounded-3xl bg-[#0A1B11]/85 border border-emerald-500/25 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0C3B7C] text-white flex items-center justify-center font-bold text-sm">
                    G
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">GCash Payment Details</h3>
                    <p className="text-[11px] text-slate-400">Shown in the primary GCash transfer card on the Donate page</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      GCash Account Name
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettingsForm.gcash_name}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, gcash_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      GCash Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettingsForm.gcash_number}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, gcash_number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    GCash QR Code Image URL
                  </label>
                  <input
                    type="text"
                    value={siteSettingsForm.gcash_qr_url}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, gcash_qr_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-slate-400">
                    Paste public URL of the official GCash QR photo.
                  </p>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="p-6 rounded-3xl bg-[#0A1B11]/85 border border-emerald-500/25 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-900/60 text-amber-300 flex items-center justify-center font-bold text-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Bank Transfer Details</h3>
                    <p className="text-[11px] text-slate-400">Official bank account credentials for institutional gifts & wire transfers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettingsForm.bank_name}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, bank_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Bank Account Name
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettingsForm.bank_account_name}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, bank_account_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettingsForm.bank_account_number}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, bank_account_number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="p-6 rounded-3xl bg-[#0A1B11]/85 border border-emerald-500/25 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold text-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Contact & HQ Information</h3>
                    <p className="text-[11px] text-slate-400">Displayed in the footer, Contact Us page, and official receipts</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={siteSettingsForm.contact_email}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Mobile Hotline / Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={siteSettingsForm.contact_phone}
                      onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Official Registered Office Address
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={siteSettingsForm.office_address}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, office_address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    value={siteSettingsForm.office_hours}
                    onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, office_hours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black text-sm px-8 py-3 rounded-2xl shadow-xl cursor-pointer"
                >
                  {isSavingSettings ? "Saving Settings..." : "Save Site Settings \u2192"}
                </Button>
              </div>
            </form>
          </section>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* CONFIRM DELETE MODAL */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full bg-[#0E1E14] border border-red-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">Confirm Deletion</h3>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Action cannot be undone</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete: <br />
              <strong className="text-white text-sm block mt-1 font-bold">&ldquo;{deleteConfirm.title}&rdquo;</strong>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={executeDelete}
                className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-5 py-2 rounded-xl shadow-lg"
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* UNIFIED CREATE & EDIT POST MODAL */}
      {/* ------------------------------------------------------------- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-2xl w-full max-h-[92vh] overflow-y-auto bg-[#0E1E14] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5 animate-in zoom-in-95">

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 gap-4">
              <div className="space-y-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    editingItemId
                      ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {editingItemId ? "Edit Item" : "Create Item"}
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                  {editingItemId ? "Edit & Update" : "Publish New Content"}
                </h3>
                <p className="text-xs text-slate-300">
                  Select item type, fill in content, toggle publication status, and save to Supabase.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPostModalOpen(false);
                  setEditingItemId(null);
                  setPostModalError(null);
                }}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error Alert Banner */}
            {postModalError && (
              <div className="p-4 rounded-2xl bg-red-950/95 border border-red-500/60 text-red-200 text-xs flex items-start gap-3 shadow-xl animate-in slide-in-from-top duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-red-100">Database Save Failed</p>
                  <p className="text-red-300 leading-relaxed font-mono text-[11px] break-words">{postModalError}</p>
                  <p className="text-slate-400 text-[10px]">Your inputs have been preserved. You can review them and retry saving.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPostModalError(null)}
                  className="text-red-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Type Selector (only on create mode) */}
            {!editingItemId && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Select Item Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: "announcement", label: "Post", icon: Megaphone },
                    { id: "event", label: "Event", icon: Calendar },
                    { id: "program", label: "Program", icon: Trees },
                    { id: "resource", label: "Resource", icon: BookOpen },
                    { id: "gallery", label: "Gallery", icon: ImageIcon },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = postModalType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPostModalType(t.id as PostModalType)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          isSelected
                            ? "bg-emerald-600 text-slate-950 border-emerald-400 shadow-md font-black"
                            : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Draft / Published Toggle */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Publication Status</span>
                <span className="text-[11px] text-slate-400">
                  {formIsPublished ? "Published (Visible on site & feeds)" : "Draft (Hidden from public)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormIsPublished(!formIsPublished)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                  formIsPublished
                    ? "bg-emerald-600 text-slate-950 border-emerald-400"
                    : "bg-slate-800 text-slate-300 border-slate-600"
                }`}
              >
                {formIsPublished ? "Published ✓" : "Draft (Unpublished)"}
              </button>
            </div>

            {/* Photo Upload & Input */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Cover Photo
                </label>
                <span className="text-[10px] text-slate-400">
                  Upload file or enter URL
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-500/40 bg-black/80 shrink-0 shadow-inner">
                  {formImageUrl ? (
                    <Image
                      src={formImageUrl}
                      alt="Preview"
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer transition-colors flex items-center gap-2 shadow-md">
                      <Upload className="w-4 h-4 stroke-[2.5]" />
                      <span>Choose from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setIsSavingPost(true);
                              const publicUrl = await uploadMedia(file, "posts");
                              setFormImageUrl(publicUrl);
                            } catch (uploadErr) {
                              // Fallback to data URL
                              const reader = new FileReader();
                              reader.onload = (uploadEvent) => {
                                const res = uploadEvent.target?.result as string;
                                if (res) setFormImageUrl(res);
                              };
                              reader.readAsDataURL(file);
                            } finally {
                              setIsSavingPost(false);
                            }
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowWildlifePicker(!showWildlifePicker)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🐾 PH Wildlife</span>
                    </button>

                    {formImageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormImageUrl("")}
                        className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-xl bg-red-950/30 border border-red-500/20"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Or paste external image URL (https://...)"
                    value={formImageUrl.startsWith("data:") ? "" : formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Wildlife Presets Picker */}
              {showWildlifePicker && (
                <div className="pt-3 border-t border-white/10 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-bold">
                      Endangered Philippine Wildlife Photography:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowWildlifePicker(false)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1.5 rounded-xl bg-black/60 border border-white/10">
                    {PHILIPPINE_ENDANGERED_ANIMALS.map((animal) => (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setFormImageUrl(animal.url);
                          setShowWildlifePicker(false);
                        }}
                        className={`p-1 rounded-lg border text-left transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          formImageUrl === animal.url
                            ? "bg-emerald-950 border-emerald-400 ring-2 ring-emerald-400/40"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        title={`${animal.name} (${animal.status})`}
                      >
                        <div className="relative w-full aspect-square rounded overflow-hidden bg-black">
                          <Image src={animal.url} alt={animal.name} fill sizes="60px" className="object-cover" unoptimized />
                        </div>
                        <span className="text-[9px] font-bold text-center line-clamp-1 text-slate-200">
                          {animal.name.split("(")[0].trim()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Post Details Form */}
            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter title..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Event-specific fields */}
              {postModalType === "event" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Event Type</label>
                      <select
                        value={formEventType}
                        onChange={(e) => setFormEventType(e.target.value as AdminEvent["type"])}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="Tree Growing">Tree Growing (Field Planting)</option>
                        <option value="Rally for Nature">Rally for Nature (Mobilization)</option>
                        <option value="Coastal Cleanup">Coastal Cleanup (Mangroves)</option>
                        <option value="Youth Eco-Camp">Youth Eco-Camp</option>
                        <option value="Community Forum">Community Forum & Paralegal</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Volunteer Target Quota</label>
                      <input
                        type="number"
                        min={1}
                        value={formTargetVolunteers}
                        onChange={(e) => setFormTargetVolunteers(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Date</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. November 28, 2026"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Time</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 7:00 AM - 1:00 PM"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanay, Rizal or Quezon Memorial Circle"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              )}

              {/* Program-specific fields */}
              {postModalType === "program" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Category</label>
                      <input
                        type="text"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder="e.g. Forestry & Reforestation"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Status</label>
                      <select
                        value={formProgramStatus}
                        onChange={(e) => setFormProgramStatus(e.target.value as AdminProgram["status"])}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Location</label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Beneficiaries / Partners</label>
                      <input
                        type="text"
                        value={formBeneficiaries}
                        onChange={(e) => setFormBeneficiaries(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Resource-specific fields */}
              {postModalType === "resource" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="Biodiversity">Biodiversity</option>
                        <option value="Zero Waste">Zero Waste</option>
                        <option value="Climate Action">Climate Action</option>
                        <option value="Community Guides">Community Guides</option>
                        <option value="Eco-Living Tips">Eco-Living Tips</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Format</label>
                      <select
                        value={formResourceFormat}
                        onChange={(e) => setFormResourceFormat(e.target.value as AdminResource["format"])}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="PDF Document">PDF Document</option>
                        <option value="Field Manual">Field Manual</option>
                        <option value="Infographic">Infographic</option>
                        <option value="Policy Brief">Policy Brief</option>
                        <option value="Spreadsheet">Spreadsheet</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Download URL</label>
                      <input
                        type="text"
                        value={formDownloadUrl}
                        onChange={(e) => setFormDownloadUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">File Size</label>
                      <input
                        type="text"
                        value={formFileSize}
                        onChange={(e) => setFormFileSize(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery-specific fields */}
              {postModalType === "gallery" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Album</label>
                      <select
                        value={formAlbum}
                        onChange={(e) => setFormAlbum(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="Tree Planting">Tree Planting</option>
                        <option value="Coastal Clean-up">Coastal Clean-up</option>
                        <option value="Youth Eco-Camp">Youth Eco-Camp</option>
                        <option value="Community Workshops">Community Workshops</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Location</label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Date/Month</label>
                      <input
                        type="text"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Announcement-specific fields */}
              {postModalType === "announcement" && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-black/30 border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="Urgent Mobilization">Urgent Mobilization</option>
                        <option value="Reforestation Update">Reforestation Update</option>
                        <option value="Advisory">Advisory</option>
                        <option value="Policy Brief">Policy Brief</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Short Summary</label>
                      <input
                        type="text"
                        placeholder="Brief 1-sentence teaser"
                        value={formSummary}
                        onChange={(e) => setFormSummary(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description / Content Body */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Content / Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details and instructions..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsPostModalOpen(false);
                    setEditingItemId(null);
                    setPostModalError(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isSavingPost}
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {isSavingPost
                    ? "Saving to Supabase..."
                    : editingItemId
                    ? "Save Changes \u2192"
                    : "Publish \u2192"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="py-6 border-t border-[#4A2814]/30 text-center text-xs text-slate-400 bg-[#120A04]/60 backdrop-blur-md">
        <p>&copy; 2026 Kamalayang Kapwa Kalikasan Foundation &bull; Internal Operations</p>
      </footer>

    </div>
  );
}
