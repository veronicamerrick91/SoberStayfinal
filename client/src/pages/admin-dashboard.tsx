import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, Building, FileText, Activity, 
  Check, X, Eye, ShieldAlert, BarChart3, AlertTriangle,
  Mail, MessageSquare, Settings, DollarSign, TrendingUp,
  Search, Download, Flag, Lock, Clock, Upload, Shield, Plus,
  CheckCircle, Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Heading1, Heading2, Link2, Quote, 
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { getReports, updateReportStatus } from "@/lib/reports";
import { UserEditModal } from "@/components/user-edit-modal";
import { ListingReviewModal } from "@/components/listing-review-modal";
import { ApplicationDetailsModal } from "@/components/application-details-modal";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  role: "Tenant" | "Provider";
  email: string;
  phone?: string;
  status: "Active" | "Suspended" | "Pending";
  verified: boolean;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [reviewingListing, setReviewingListing] = useState<any | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [viewingApplication, setViewingApplication] = useState<any | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [safetySettings, setSafetySettings] = useState<any[]>([
    { id: 1, label: "Auto-flag drug references", enabled: true },
    { id: 2, label: "Monitor external contact attempts", enabled: true },
    { id: 3, label: "Require provider verification", enabled: true },
    { id: 4, label: "Enable duplicate account detection", enabled: true },
  ]);
  const [campaigns, setCampaigns] = useState<any[]>([
    { name: "Provider Onboarding Series", status: "Active", recipients: 145, sent: "Dec 1, 2024", opens: "52", clicks: "18" },
    { name: "Tenant Recovery Resources", status: "Scheduled", recipients: 320, sent: "Dec 8, 2024", opens: "-", clicks: "-" },
    { name: "Featured Listing Promotion", status: "Draft", recipients: 0, sent: "-", opens: "-", clicks: "-" },
  ]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<any[]>([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignRecipients, setNewCampaignRecipients] = useState("All Tenants");
  const [smsAudience, setSmsAudience] = useState("All Users");
  const [smsContent, setSmsContent] = useState("");
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);
  const [showSubscriptionWaiverModal, setShowSubscriptionWaiverModal] = useState(false);
  const [waivingProvider, setWaivingProvider] = useState("");
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState("onSignup");
  const [newWorkflowTemplate, setNewWorkflowTemplate] = useState("welcome");
  const [newWorkflowSubject, setNewWorkflowSubject] = useState("");
  const [newWorkflowBody, setNewWorkflowBody] = useState("");
  const [incidentReports, setIncidentReports] = useState<any[]>([
    { id: 1, provider: "Recovery First LLC", incident: "Staff training overdue", severity: "High", reported: "Dec 3, 2024", dueDate: "Dec 5, 2024", description: "Annual staff safety training not completed for 3 staff members" },
    { id: 2, provider: "Hope House", incident: "Maintenance issue reported", severity: "Medium", reported: "Dec 2, 2024", dueDate: "Dec 8, 2024", description: "Faulty exit sign in dormitory - needs immediate replacement" },
    { id: 3, provider: "Serenity Living", incident: "Policy violation", severity: "High", reported: "Dec 1, 2024", dueDate: "Dec 4, 2024", description: "Unauthorized guest overnight - requires incident investigation" },
  ]);
  const [complianceIssues, setComplianceIssues] = useState<any[]>([
    { id: 1, provider: "Recovery First LLC", issue: "Missing Fire Inspection", status: "Pending", dueDate: "Dec 10, 2024", details: "Annual fire safety inspection overdue by 15 days", contact: "admin@recoveryfirst.com" },
    { id: 2, provider: "Hope House", issue: "Expired Insurance Certificate", status: "Urgent", dueDate: "Dec 5, 2024", details: "Liability insurance expires Dec 15, 2024. Renewal required", contact: "contact@hopehouse.org" },
    { id: 3, provider: "New Beginnings Home", issue: "Staff Background Check", status: "Pending", dueDate: "Dec 12, 2024", details: "Two new staff members require updated background checks", contact: "office@newbeginnings.org" },
  ]);
  const [viewingComplianceIssue, setViewingComplianceIssue] = useState<any | null>(null);
  const [showComplianceDetailsModal, setShowComplianceDetailsModal] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState<any[]>([
    { id: 1, name: "Business License", uploaded: false },
    { id: 2, name: "Insurance Certificate", uploaded: false },
    { id: 3, name: "Facility Photos", uploaded: false },
    { id: 4, name: "Safety Compliance Report", uploaded: false },
    { id: 5, name: "Property Inspection Report", uploaded: false }
  ]);
  const [supportTickets, setSupportTickets] = useState<any[]>([
    { id: "#2451", user: "John Doe (Tenant)", subject: "Payment issue on application", status: "Open", priority: "high", created: "2 hours ago", message: "I'm unable to complete my application due to payment processing error" },
    { id: "#2450", user: "Recovery LLC (Provider)", subject: "Can't upload photos", status: "In Progress", priority: "medium", created: "4 hours ago", message: "Getting an error when trying to upload facility photos" },
    { id: "#2449", user: "Sarah Connor (Tenant)", subject: "Message notification not working", status: "Resolved", priority: "low", created: "1 day ago", message: "Not receiving message notifications from providers" },
  ]);
  const newTicketsCount = supportTickets.filter(t => t.status === "Open").length;
  const [viewingSupportTicket, setViewingSupportTicket] = useState<any | null>(null);
  const [showSupportDetailsModal, setShowSupportDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [newUsers, setNewUsers] = useState(3);
  const [newListings, setNewListings] = useState(2);
  const [newApplications, setNewApplications] = useState(5);
  const [newVerifications, setNewVerifications] = useState(1);
  const [viewingDocument, setViewingDocument] = useState<any | null>(null);
  const [showDocumentPreviewModal, setShowDocumentPreviewModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [requestInfoMessage, setRequestInfoMessage] = useState("");
  const [showDenyDocumentModal, setShowDenyDocumentModal] = useState(false);
  const [denyDocumentReason, setDenyDocumentReason] = useState("");
  const [newBillingSubscriptions, setNewBillingSubscriptions] = useState(2);
  const [emailBodyText, setEmailBodyText] = useState("");
  const [emailFont, setEmailFont] = useState("Arial");
  const [emailFontSize, setEmailFontSize] = useState(16);
  const [emailFontColor, setEmailFontColor] = useState("#ffffff");
  const [emailSubject, setEmailSubject] = useState("");
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [automatedCampaigns, setAutomatedCampaigns] = useState<any[]>([
    { id: 1, name: "New Provider Onboarding", trigger: "On Signup", audience: "New Providers", emails: 7, active: true, lastRun: "Dec 3, 2024", enrolled: 23 },
    { id: 2, name: "Tenant Recovery Tips Weekly", trigger: "Weekly", audience: "All Tenants", emails: 1, active: true, lastRun: "Dec 2, 2024", enrolled: 142 },
    { id: 3, name: "Subscription Renewal Reminder", trigger: "7 Days Before", audience: "Providers", emails: 3, active: false, lastRun: "Nov 28, 2024", enrolled: 0 },
  ]);
  const [newAutoCampaignName, setNewAutoCampaignName] = useState("");
  const [newAutoCampaignTrigger, setNewAutoCampaignTrigger] = useState("on-signup");
  const [newAutoCampaignAudience, setNewAutoCampaignAudience] = useState("tenants");
  const [newAutoCampaignEmails, setNewAutoCampaignEmails] = useState(1);
  const [showNewAutoCampaignModal, setShowNewAutoCampaignModal] = useState(false);
  const [emailSubscribers, setEmailSubscribers] = useState<any[]>([
    { id: 1, email: "john.doe@example.com", subscribeDate: "Dec 1, 2024", status: "Active" },
    { id: 2, email: "sarah.smith@example.com", subscribeDate: "Dec 2, 2024", status: "Active" },
    { id: 3, email: "mike.wilson@example.com", subscribeDate: "Dec 3, 2024", status: "Active" },
  ]);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCategory, setBlogCategory] = useState("Recovery Tips");
  const [blogFont, setBlogFont] = useState("Georgia");
  const [blogFontSize, setBlogFontSize] = useState(16);
  const [blogFontColor, setBlogFontColor] = useState("#ffffff");
  const [publishedBlogPosts, setPublishedBlogPosts] = useState<any[]>([]);
  const [blogPublishSuccess, setBlogPublishSuccess] = useState(false);
  const [blogAuthor, setBlogAuthor] = useState("Admin");
  const [blogTags, setBlogTags] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogScheduleDate, setBlogScheduleDate] = useState("");
  const [blogAutoSaved, setBlogAutoSaved] = useState(false);
  const [draftSaveTimeout, setDraftSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [flaggedListings, setFlaggedListings] = useState<Set<string>>(new Set());
  const [showDenyApplicationModal, setShowDenyApplicationModal] = useState(false);
  const [denyApplicationReason, setDenyApplicationReason] = useState("");

  const documentDenialReasons = [
    "Document is expired or invalid",
    "Document is illegible or incomplete",
    "Document does not match requirements",
    "Unauthorized provider or wrong facility",
    "Additional verification required",
    "Document contains falsified information",
    "Missing required certifications or seals",
    "Incorrect date or filing information",
    "Out of compliance with regulations",
    "Other (request more info)"
  ];

  useEffect(() => {
    setReports(getReports());
    setListings(MOCK_PROPERTIES.map((prop, idx) => ({
      ...prop,
      status: idx % 2 === 0 ? "Pending" : "Approved"
    })));
    
    // Initialize mock verification documents
    setDocuments([
      {
        id: "doc-1",
        documentName: "Business License",
        documentType: "License",
        provider: "Recovery First LLC",
        providerEmail: "admin@recoveryfirst.com",
        uploadedDate: "2024-12-01",
        status: "Pending Review",
        fileSize: "2.4 MB"
      },
      {
        id: "doc-2",
        documentName: "Liability Insurance Certificate",
        documentType: "Insurance",
        provider: "Hope House",
        providerEmail: "contact@hopehouse.org",
        uploadedDate: "2024-12-02",
        status: "Pending Review",
        fileSize: "1.8 MB"
      },
      {
        id: "doc-3",
        documentName: "Staff Background Check - John Smith",
        documentType: "Background Check",
        provider: "Serenity Living",
        providerEmail: "info@serenityliving.com",
        uploadedDate: "2024-11-28",
        status: "Approved",
        fileSize: "856 KB"
      },
      {
        id: "doc-4",
        documentName: "Fire Safety Inspection Report",
        documentType: "Safety Certification",
        provider: "New Beginnings Home",
        providerEmail: "office@newbeginnings.org",
        uploadedDate: "2024-11-30",
        status: "Pending Review",
        fileSize: "3.1 MB"
      },
      {
        id: "doc-5",
        documentName: "Zoning Compliance Letter",
        documentType: "Zoning",
        provider: "Pathway Recovery",
        providerEmail: "admin@pathwayrecovery.com",
        uploadedDate: "2024-11-25",
        status: "Rejected",
        denialReason: "Document is expired. Please submit current zoning compliance letter dated within last 12 months.",
        fileSize: "1.2 MB"
      }
    ]);
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setShowEditModal(false);
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "Suspended" ? "Active" : "Suspended" }
        : u
    ));
  };

  const handleReviewListing = (listing: any) => {
    setReviewingListing(listing);
    setShowReviewModal(true);
  };

  const handleApproveListing = (listingId: string) => {
    setListings(listings.map(l => l.id === listingId ? { ...l, status: "Approved" } : l));
    setShowReviewModal(false);
  };

  const handleDenyListing = (listingId: string, reason: string) => {
    setListings(listings.map(l => l.id === listingId ? { ...l, status: "Rejected", denialReason: reason } : l));
    setShowReviewModal(false);
  };

  const handleViewApplication = (app: any) => {
    setViewingApplication(app);
    setShowApplicationModal(true);
  };

  const handleApproveApplication = (appId: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: "Approved" } : a));
  };

  const handleDenyApplication = (appId: string, reason: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: "Denied", denialReason: reason } : a));
    setShowDenyApplicationModal(false);
    setDenyApplicationReason("");
  };

  const handleFlagListing = (listingId: string) => {
    const newFlagged = new Set(flaggedListings);
    if (newFlagged.has(listingId)) {
      newFlagged.delete(listingId);
    } else {
      newFlagged.add(listingId);
    }
    setFlaggedListings(newFlagged);
  };

  const handleDownloadDocument = (doc: any) => {
    console.log("Download clicked for:", doc.documentName);
    
    try {
      const documentContent = `===============================================
DOCUMENT VERIFICATION RECORD
===============================================

Document Name: ${doc.documentName}
Document Type: ${doc.documentType}
Provider: ${doc.provider}
Email: ${doc.providerEmail}
File Size: ${doc.fileSize}
Submitted: ${doc.uploadedDate}
Current Status: ${doc.status}

===============================================
This is a simulated document download.
In a production system, this would download
the actual document file stored on the server.
===============================================`;

      // Create data URL
      const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(documentContent);
      
      // Create and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", dataUrl);
      link.setAttribute("download", `${doc.documentName.replace(/\s+/g, "_")}.txt`);
      link.style.display = "none";
      
      document.body.appendChild(link);
      console.log("Clicking download link...");
      link.click();
      document.body.removeChild(link);
      
      console.log("Download initiated successfully");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleRequestApplicationInfo = (appId: string, message: string) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status: "Needs Info", infoRequest: message } : a));
  };

  const handleClearFlag = (msgId: string) => {
    setMessages(messages.map(m => m.id === msgId ? { ...m, flagged: false, reason: null } : m));
  };

  const handleBanUser = (msgId: string) => {
    setMessages(messages.filter(m => m.id !== msgId));
  };

  const handleApproveDocument = (docId: string) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, status: "Approved", reviewedAt: new Date().toISOString() } : d));
    setShowDocumentPreviewModal(false);
    setViewingDocument(null);
  };

  const handleRejectDocument = (docId: string) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, status: "Rejected", denialReason: denyDocumentReason, reviewedAt: new Date().toISOString() } : d));
    setShowDenyDocumentModal(false);
    setDenyDocumentReason("");
    setViewingDocument(null);
  };

  const handleRequestDocumentInfo = (docId: string) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, status: "More Info Requested", infoRequest: requestInfoMessage, reviewedAt: new Date().toISOString() } : d));
    setShowRequestInfoModal(false);
    setRequestInfoMessage("");
    setViewingDocument(null);
  };

  const handleViewDocument = (doc: any) => {
    setViewingDocument(doc);
    setShowDocumentPreviewModal(true);
  };

  const openDenyModal = (doc: any) => {
    setViewingDocument(doc);
    setShowDenyDocumentModal(true);
  };

  const openRequestInfoModal = (doc: any) => {
    setViewingDocument(doc);
    setShowRequestInfoModal(true);
  };

  const toggleSafetySettings = (settingId: number) => {
    setSafetySettings(safetySettings.map(s => s.id === settingId ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSaveSettings = () => {
    // Settings saved
  };

  const handleResetSettings = () => {
    setSafetySettings([
      { id: 1, label: "Auto-flag drug references", enabled: true },
      { id: 2, label: "Monitor external contact attempts", enabled: true },
      { id: 3, label: "Require provider verification", enabled: true },
      { id: 4, label: "Enable duplicate account detection", enabled: true },
    ]);
  };

  const handleSendReminder = (issueId: number) => {
    setComplianceIssues(complianceIssues.map(issue => 
      issue.id === issueId ? { ...issue, status: "Reminder Sent" } : issue
    ));
  };

  const handleRequestUpdate = (issueId: number) => {
    setComplianceIssues(complianceIssues.map(issue => 
      issue.id === issueId ? { ...issue, status: "Update Requested" } : issue
    ));
  };

  const handleViewComplianceDetails = (issue: any) => {
    setViewingComplianceIssue(issue);
    setShowComplianceDetailsModal(true);
  };

  const handleSendPaymentReminder = (provider: string, email: string) => {
    console.log(`Sent payment reminder to ${provider} at ${email}`);
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${provider} at ${email}`,
    });
  };

  const handleContactProvider = (provider: string, email: string) => {
    console.log(`Contacting ${provider} at ${email}`);
    toast({
      title: "Contact Sent",
      description: `Contact request initiated for ${provider}. Email: ${email}`,
    });
  };

  const handleUploadDocument = (docId: number) => {
    setRequiredDocs(requiredDocs.map(doc =>
      doc.id === docId ? { ...doc, uploaded: true } : doc
    ));
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      users: users.length,
      listings: listings.length,
      applications: applications.length,
      documents: documents.length,
      reports: reports.length,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-export-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const handleSendCampaign = () => {
    // Campaign sent - action complete
  };

  const handleCreateCampaign = () => {
    setShowNewCampaignModal(true);
    setNewCampaignName("");
    setNewCampaignRecipients("All Tenants");
  };

  const handleSaveNewCampaign = () => {
    if (newCampaignName.trim()) {
      const recipientCounts: any = { "All Tenants": 520, "All Providers": 145, "Active Subscribers": 312, "Inactive Users": 89 };
      setCampaigns([...campaigns, { name: newCampaignName, status: "Draft", recipients: recipientCounts[newCampaignRecipients] || 0 }]);
      setShowNewCampaignModal(false);
    }
  };

  const handleDeleteCampaign = (idx: number) => {
    setCampaigns(campaigns.filter((_, i) => i !== idx));
  };

  const handleSendSMS = () => {
    if (smsContent.trim()) {
      setSmsSentSuccess(true);
      setSmsContent("");
      setTimeout(() => setSmsSentSuccess(false), 3000);
    }
  };

  const handleCreateAutomatedCampaign = () => {
    if (!newAutoCampaignName.trim()) return;
    const triggers: { [key: string]: string } = {
      "on-signup": "On Signup",
      "weekly": "Weekly",
      "on-purchase": "On Purchase",
      "on-renewal": "7 Days Before",
      "on-abandonment": "On Abandonment",
    };
    const audiences: { [key: string]: string } = {
      "tenants": "All Tenants",
      "providers": "All Providers",
      "new-users": "New Users",
      "inactive": "Inactive Users",
    };
    const newCampaign = {
      id: automatedCampaigns.length + 1,
      name: newAutoCampaignName,
      trigger: triggers[newAutoCampaignTrigger] || "On Signup",
      audience: audiences[newAutoCampaignAudience] || "All Tenants",
      emails: newAutoCampaignEmails,
      active: true,
      lastRun: new Date().toLocaleDateString(),
      enrolled: Math.floor(Math.random() * 200) + 50,
    };
    setAutomatedCampaigns([...automatedCampaigns, newCampaign]);
    setNewAutoCampaignName("");
    setNewAutoCampaignTrigger("on-signup");
    setNewAutoCampaignAudience("tenants");
    setNewAutoCampaignEmails(1);
    setShowNewAutoCampaignModal(false);
    toast({
      title: "Automated Campaign Created",
      description: `"${newAutoCampaignName}" campaign is now active`,
    });
  };

  const handleToggleAutoCampaign = (id: number) => {
    setAutomatedCampaigns(automatedCampaigns.map(c =>
      c.id === id ? { ...c, active: !c.active } : c
    ));
  };

  const handleDeleteAutoCampaign = (id: number) => {
    setAutomatedCampaigns(automatedCampaigns.filter(c => c.id !== id));
    toast({
      title: "Campaign Deleted",
      description: "Automated campaign has been removed",
    });
  };

  const handleCreateBlog = () => {
    setBlogTitle("");
    setBlogContent("");
    setBlogExcerpt("");
    setBlogCategory("Recovery Tips");
    setBlogFont("Georgia");
    setBlogFontSize(16);
    setBlogFontColor("#ffffff");
    setBlogAuthor("Admin");
    setBlogTags("");
    setBlogSlug("");
    setBlogScheduleDate("");
    setBlogAutoSaved(false);
    setShowBlogModal(true);
  };

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = document.getElementById("blog-content-textarea") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = blogContent.substring(start, end);
      const newText = blogContent.substring(0, start) + prefix + selectedText + suffix + blogContent.substring(end);
      setBlogContent(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    }
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadTime = (wordCount: number) => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes < 1 ? "< 1 min read" : `${minutes} min read`;
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const autoSaveDraft = (content: string, title: string) => {
    if (draftSaveTimeout) {
      clearTimeout(draftSaveTimeout);
    }
    const timeout = setTimeout(() => {
      if (title.trim() || content.trim()) {
        const draft = {
          title,
          content,
          author: blogAuthor,
          excerpt: blogExcerpt,
          category: blogCategory,
          tags: blogTags,
          slug: blogSlug,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem("sober-stay-blog-draft", JSON.stringify(draft));
        setBlogAutoSaved(true);
        setTimeout(() => setBlogAutoSaved(false), 2000);
      }
    }, 1500);
    setDraftSaveTimeout(timeout);
  };

  const handleSaveBlog = () => {
    if (blogTitle.trim() && blogContent.trim()) {
      const newPost = {
        id: `admin-${Date.now()}`,
        title: blogTitle,
        excerpt: blogExcerpt || blogContent.substring(0, 150) + "...",
        content: blogContent,
        author: blogAuthor || "Admin",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        category: blogCategory,
        tags: blogTags.split(",").map(t => t.trim()).filter(t => t),
        slug: blogSlug || generateSlug(blogTitle),
        status: "Draft"
      };
      setPublishedBlogPosts([newPost, ...publishedBlogPosts]);
      setBlogAutoSaved(true);
      setTimeout(() => setBlogAutoSaved(false), 2000);
    }
    setShowBlogModal(false);
  };

  const handlePublishBlog = () => {
    if (blogTitle.trim() && blogContent.trim()) {
      const newPost = {
        id: `admin-${Date.now()}`,
        title: blogTitle,
        excerpt: blogExcerpt || blogContent.substring(0, 150) + "...",
        content: blogContent,
        author: blogAuthor || "Admin",
        date: blogScheduleDate ? new Date(blogScheduleDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        category: blogCategory,
        tags: blogTags.split(",").map(t => t.trim()).filter(t => t),
        slug: blogSlug || generateSlug(blogTitle)
      };
      setPublishedBlogPosts([newPost, ...publishedBlogPosts]);
      
      const existingPosts = JSON.parse(localStorage.getItem("sober-stay-admin-posts") || "[]");
      localStorage.setItem("sober-stay-admin-posts", JSON.stringify([newPost, ...existingPosts]));
      
      setBlogPublishSuccess(true);
      setTimeout(() => setBlogPublishSuccess(false), 3000);
    }
    setShowBlogModal(false);
    setShowBlogEditor(false);
  };

  const handleCreatePromo = () => {
    setPromoCodes([...promoCodes, { code: "NEWCODE", discount: "20% off", target: "General", used: 0 }]);
  };

  const handleLaunchAd = () => {
    setAdCampaigns([...adCampaigns, { home: "New Ad Campaign", duration: "14 days", cost: "$299", status: "Active" }]);
  };

  const handleEditCampaign = (idx: number) => {
    setEditingCampaign({ ...campaigns[idx], idx });
  };

  const handleSaveCampaign = (updates: any) => {
    if (editingCampaign && editingCampaign.idx !== undefined) {
      setCampaigns(campaigns.map((c, i) => i === editingCampaign.idx ? { ...c, ...updates } : c));
    }
    setEditingCampaign(null);
  };

  const handleManageListing = () => {
    setEditingListing({ provider: "Recovery First LLC", listing: "Downtown Recovery Center" });
  };

  const handleCloseListing = () => {
    setEditingListing(null);
  };

  const handleSaveMarketing = () => {
    // Marketing plan saved
  };

  const handleDownloadReport = () => {
    // Report downloaded
  };

  const handleWaiveSubscription = (providerName: string) => {
    setWaivingProvider(providerName);
    setShowSubscriptionWaiverModal(true);
  };

  const handleConfirmWaiver = () => {
    setShowSubscriptionWaiverModal(false);
    setWaivingProvider("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview, management & controls</p>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="border-red-500 text-red-500 px-3 py-1">
                <ShieldAlert className="w-3 h-3 mr-1" /> Admin Mode
             </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-gradient-to-r from-card via-card to-card border border-border/50 p-2 flex gap-2 h-auto justify-start rounded-lg shadow-sm overflow-x-auto">
            <TabsTrigger value="overview" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><Users className="w-4 h-4" /> Users {newUsers > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="listings" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><Building className="w-4 h-4" /> Listings {newListings > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="applications" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all relative">Applications {newApplications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="messaging" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><MessageSquare className="w-4 h-4" /> Messages {messages.filter(m => m.flagged).length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="verification" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><Shield className="w-4 h-4" /> Verification {newVerifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="reports" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2"><AlertTriangle className="w-4 h-4" /> Reports</TabsTrigger>
            <TabsTrigger value="compliance" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><ShieldAlert className="w-4 h-4" /> Safety {complianceIssues.filter(i => i.status === "Urgent").length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="billing" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><DollarSign className="w-4 h-4" /> Billing {newBillingSubscriptions > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="analytics" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2"><BarChart3 className="w-4 h-4" /> Analytics</TabsTrigger>
            <TabsTrigger value="support" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2 relative"><Mail className="w-4 h-4" /> Support {newTicketsCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="marketing" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2"><TrendingUp className="w-4 h-4" /> Marketing</TabsTrigger>
            <TabsTrigger value="workflows" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2"><Activity className="w-4 h-4" /> Workflows</TabsTrigger>
            <TabsTrigger value="email-list" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2"><Mail className="w-4 h-4" /> Email List</TabsTrigger>
            <TabsTrigger value="settings" className="px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-2"><Settings className="w-4 h-4" /> Settings</TabsTrigger>
          </TabsList>

          {blogPublishSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Blog post published successfully! It is now visible on the public blog page.</span>
            </div>
          )}

          {/* DASHBOARD OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <Users className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Total Users: 1,240</p>
                  <p className="text-xs text-muted-foreground">850 Tenants • 390 Providers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <Building className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Active Listings: 145</p>
                  <p className="text-xs text-muted-foreground">12 pending verification</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Applications: 892</p>
                  <p className="text-xs text-muted-foreground">+45 this week</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <DollarSign className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Revenue: $12.4k</p>
                  <p className="text-xs text-muted-foreground">From subscriptions this month</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-3">Alerts & Flags</h3>
                {[
                  { icon: AlertTriangle, title: "Suspicious Activity", desc: "User: john_recovery | Location: 5 failed logins from different countries in 2 hours | Email: john@example.com | Time: Dec 5, 2:30 PM", color: "red" },
                  { icon: Flag, title: "Inappropriate Message", desc: "Conversation between mike_provider and sarah_tenant | Message contains restricted keywords | Flagged by moderation on Dec 5, 1:45 PM | Requires review", color: "amber" },
                  { icon: Lock, title: "Payment Failed", desc: "Provider: Hope House LLC | Failed charge: $49.00 | Payment method expired | Account suspended automatically | Action required by Dec 7", color: "red" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default border-b border-border/50 last:border-0">
                    <alert.icon className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
                {[
                  { action: "User verified", user: "Admin Team", time: "2 mins ago" },
                  { action: "Listing approved", user: "Platform", time: "15 mins ago" },
                  { action: "Application denied", user: "Admin Team", time: "1 hour ago" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-white font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* USERS MANAGEMENT */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">User Management ({users.length})</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Search users..." className="bg-background/50 border-white/10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Button size="sm" variant="outline">Filter</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.role === "Provider" ? "default" : "secondary"}>{user.role}</Badge>
                        <Badge variant={user.status === "Active" ? "default" : "outline"} className={user.status === "Active" ? "bg-green-500/80" : user.status === "Suspended" ? "bg-red-500/80" : "bg-amber-500/80"}>{user.status}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" onClick={() => handleEditUser(user)}>Edit</Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={`h-8 ${user.status === "Suspended" ? "text-green-500 hover:bg-green-500/10" : "text-red-500 hover:bg-red-500/10"}`}
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            {user.status === "Suspended" ? "Unsuspend" : "Suspend"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LISTINGS MANAGEMENT */}
          <TabsContent value="listings" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Listing Management ({listings.length})</h3>
              {listings.map((listing) => (
                <div key={listing.id} className="p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-border/50 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-3 flex-1">
                      <img src={listing.image} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{listing.name}</p>
                        <p className="text-xs text-muted-foreground">{listing.address}, {listing.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {listing.isVerified && <Badge className="bg-green-500/80 text-xs">Verified</Badge>}
                      <Badge variant="outline" className="text-xs">${listing.price}/{listing.pricePeriod}</Badge>
                      <Badge variant="secondary" className="text-xs">{listing.bedsAvailable} beds</Badge>
                      <Badge className={
                        listing.status === "Approved" ? "bg-green-500/80 text-xs" :
                        listing.status === "Rejected" ? "bg-red-500/80 text-xs" :
                        "bg-amber-500/80 text-xs"
                      }>{listing.status}</Badge>
                      {flaggedListings.has(listing.id) && <Badge className="bg-red-500/80 text-xs">⚠ Flagged</Badge>}
                    </div>
                  </div>
                  
                  {listing.denialReason && (
                    <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm">
                      <span className="text-red-400 font-medium">Denial Reason:</span> <span className="text-red-300">{listing.denialReason}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {listing.status === "Pending" && (
                      <>
                        <Button size="sm" onClick={() => handleReviewListing(listing)} className="bg-primary/20 text-primary hover:bg-primary/30 h-7 text-xs">Review</Button>
                        <Button size="sm" onClick={() => handleFlagListing(listing.id)} variant="ghost" className={`h-7 text-xs ${flaggedListings.has(listing.id) ? "text-red-400" : "text-red-500"} hover:bg-red-500/10`}>{flaggedListings.has(listing.id) ? "Unflag" : "Flag"}</Button>
                      </>
                    )}
                    {listing.status !== "Pending" && (
                      <Button size="sm" onClick={() => handleFlagListing(listing.id)} variant="ghost" className={`h-7 text-xs ${flaggedListings.has(listing.id) ? "text-red-400" : "text-red-500"} hover:bg-red-500/10`}>{flaggedListings.has(listing.id) ? "Unflag" : "Flag"}</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* APPLICATIONS REVIEW */}
          <TabsContent value="applications" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Tenant Applications ({applications.length})</h3>
              {applications.map((app) => (
                <div key={app.id} className="p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5 border-b border-border/50 last:border-0"
                onClick={() => handleViewApplication(app)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium">{app.tenantName}</p>
                      <p className="text-xs text-muted-foreground">{app.propertyName} • {new Date(app.submittedDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{app.email} • {app.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        app.status === "Approved" ? "bg-green-500/80" :
                        app.status === "Denied" ? "bg-red-500/80" :
                        app.status === "Needs Info" ? "bg-blue-500/80" :
                        "bg-amber-500/80"
                      }>{app.status}</Badge>
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">{app.completeness}% Complete</Badge>
                    </div>
                  </div>
                  {app.denialReason && (
                    <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm">
                      <span className="text-red-400 font-medium">Denial Reason:</span> <span className="text-red-300">{app.denialReason}</span>
                    </div>
                  )}
                  <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${app.completeness}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* PROVIDER VERIFICATION CENTER */}
          <TabsContent value="verification" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Provider Document Verification
                </CardTitle>
                <p className="text-sm text-muted-foreground">Review and verify submitted provider documents</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {documents.filter(d => d.status === "Pending Review").length} Pending
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {documents.filter(d => d.status === "Approved").length} Approved
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 text-xs">
                    {documents.filter(d => d.status === "Rejected").length} Rejected
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                    {documents.filter(d => d.status === "More Info Requested").length} Awaiting Info
                  </Badge>
                </div>
                
                {documents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No documents submitted for verification</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className={`p-4 rounded-lg border transition-all ${
                        doc.status === "Pending Review" ? "bg-amber-500/5 border-amber-500/20" :
                        doc.status === "Approved" ? "bg-green-500/5 border-green-500/20" :
                        doc.status === "Rejected" ? "bg-red-500/5 border-red-500/20" :
                        doc.status === "More Info Requested" ? "bg-blue-500/5 border-blue-500/20" :
                        "bg-white/5 border-border/50"
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-primary" />
                              <p className="text-white font-bold">{doc.documentName}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Provider: <span className="text-white">{doc.provider}</span></p>
                            <p className="text-xs text-muted-foreground">{doc.providerEmail}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary gap-1">
                                <FileText className="w-3 h-3" /> {doc.documentType}
                              </Badge>
                              <Badge className="text-xs bg-gray-600/50">
                                <Clock className="w-3 h-3 mr-1" /> Submitted: {new Date(doc.uploadedDate).toLocaleDateString()}
                              </Badge>
                              {doc.fileSize && (
                                <Badge variant="outline" className="text-xs">{doc.fileSize}</Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={
                            doc.status === "Approved" ? "bg-green-500/80" :
                            doc.status === "Rejected" ? "bg-red-500/80" :
                            doc.status === "More Info Requested" ? "bg-blue-500/80" :
                            "bg-amber-500/80"
                          }>{doc.status}</Badge>
                        </div>
                        
                        {doc.denialReason && (
                          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm">
                            <span className="text-red-400 font-medium">Denial Reason:</span> <span className="text-red-300">{doc.denialReason}</span>
                          </div>
                        )}
                        
                        {doc.infoRequest && (
                          <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
                            <span className="text-blue-400 font-medium">Info Requested:</span> <span className="text-blue-300">{doc.infoRequest}</span>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc)} className="h-8 gap-1 text-xs">
                            <Eye className="w-3 h-3" /> View Document
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)} className="h-8 gap-1 text-xs">
                            <Download className="w-3 h-3" /> Download
                          </Button>
                          {(doc.status === "Pending Review" || doc.status === "More Info Requested") && (
                            <>
                              <Button size="sm" onClick={() => handleApproveDocument(doc.id)} className="h-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 gap-1 text-xs">
                                <Check className="w-3 h-3" /> Verify
                              </Button>
                              <Button size="sm" onClick={() => openDenyModal(doc)} variant="outline" className="h-8 border-red-500/30 text-red-500 hover:bg-red-500/10 gap-1 text-xs">
                                <X className="w-3 h-3" /> Deny
                              </Button>
                              <Button size="sm" onClick={() => openRequestInfoModal(doc)} variant="outline" className="h-8 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-1 text-xs">
                                <MessageSquare className="w-3 h-3" /> Request More Info
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </TabsContent>

          {/* MESSAGING OVERSIGHT */}
          <TabsContent value="messaging" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Message Moderation ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>All messages are clean</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg border ${msg.flagged ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-border/50"}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium text-sm">{msg.tenant} → {msg.provider}</p>
                            <p className="text-xs text-muted-foreground">{msg.preview}</p>
                          </div>
                          {msg.flagged && <Badge className="bg-red-500/80 text-xs">{msg.reason}</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">View Thread</Button>
                          {msg.flagged && (
                            <>
                              <Button size="sm" onClick={() => handleClearFlag(msg.id)} variant="ghost" className="h-7 text-xs text-green-500 hover:bg-green-500/10">Clear</Button>
                              <Button size="sm" onClick={() => handleBanUser(msg.id)} variant="ghost" className="h-7 text-xs text-red-500 hover:bg-red-500/10">Ban User</Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LISTING REPORTS */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Flag className="w-5 h-5" /> Listing Reports ({reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Flag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No reports yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className={`p-4 rounded-lg border ${
                        report.status === "New" ? "bg-red-500/10 border-red-500/20" :
                        report.status === "Investigating" ? "bg-amber-500/10 border-amber-500/20" :
                        "bg-green-500/10 border-green-500/20"
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-white font-bold">{report.propertyName}</p>
                            <p className="text-sm text-muted-foreground">Reported by: {report.userName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={
                              report.category === "Safety" ? "bg-red-500/80" :
                              report.category === "Scam" ? "bg-orange-500/80" :
                              report.category === "Inappropriate Content" ? "bg-purple-500/80" :
                              report.category === "Contact Issues" ? "bg-blue-500/80" :
                              "bg-gray-500/80"
                            }>{report.category}</Badge>
                            <Badge className={
                              report.status === "New" ? "bg-red-500/80" :
                              report.status === "Investigating" ? "bg-amber-500/80" :
                              "bg-green-500/80"
                            }>{report.status}</Badge>
                          </div>
                        </div>
                        <div className="bg-black/20 p-3 rounded mb-3 max-h-24 overflow-y-auto">
                          <p className="text-sm text-gray-300">{report.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {report.status === "New" && (
                            <>
                              <Button size="sm" className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 h-8 text-xs" 
                                onClick={() => {
                                  updateReportStatus(report.id, "Investigating");
                                  setReports(getReports());
                                }}>
                                Investigate
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 h-8 text-xs">
                                Dismiss
                              </Button>
                            </>
                          )}
                          {report.status === "Investigating" && (
                            <>
                              <Button size="sm" className="bg-green-500/20 text-green-500 hover:bg-green-500/30 h-8 text-xs"
                                onClick={() => {
                                  updateReportStatus(report.id, "Resolved");
                                  setReports(getReports());
                                }}>
                                Resolve
                              </Button>
                              <Button size="sm" variant="outline" className="border-primary/20 h-8 text-xs">Contact Provider</Button>
                            </>
                          )}
                          {report.status === "Resolved" && (
                            <span className="text-xs text-green-500 font-medium">✓ Marked as Resolved</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPLIANCE & SAFETY */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Safety & Compliance Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-white/5 border-border">
                      <CardContent className="pt-4">
                        <p className="text-xs font-bold text-primary mb-3">Incident Reports</p>
                        <div className="text-3xl font-bold text-white mb-1">{incidentReports.length}</div>
                        <p className="text-xs text-muted-foreground">{incidentReports.filter(i => i.severity === "High").length} High severity</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-border">
                      <CardContent className="pt-4">
                        <p className="text-xs font-bold text-primary mb-3">Compliance Issues</p>
                        <div className="text-3xl font-bold text-white mb-1">{complianceIssues.length}</div>
                        <p className="text-xs text-muted-foreground">{complianceIssues.filter(i => i.status === "Urgent").length} Urgent</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-border">
                      <CardContent className="pt-4">
                        <p className="text-xs font-bold text-primary mb-3">Overdue Items</p>
                        <div className="text-3xl font-bold text-red-500 mb-1">2</div>
                        <p className="text-xs text-muted-foreground">Action required today</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h3 className="text-white font-bold text-sm mb-3">Active Incident Reports</h3>
                    {incidentReports.map((report) => (
                      <div key={report.id} className={`p-4 rounded-lg border ${
                        report.severity === "High" ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{report.provider}</p>
                            <p className="text-sm text-white font-semibold mt-1">{report.incident}</p>
                            <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Reported: {report.reported}</span>
                              <span>Due: {report.dueDate}</span>
                            </div>
                          </div>
                          <Badge className={`text-xs whitespace-nowrap ${report.severity === "High" ? "bg-red-500/80" : "bg-amber-500/80"}`}>{report.severity}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 mt-6">
                    <h3 className="text-white font-bold text-sm mb-3">Compliance Issues Requiring Action</h3>
                    {complianceIssues.map((issue) => (
                      <div key={issue.id} className={`p-4 rounded-lg border ${
                        issue.status === "Urgent" ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{issue.provider}</p>
                            <p className="text-sm text-white font-semibold mt-1">{issue.issue}</p>
                            <p className="text-xs text-muted-foreground mt-1">{issue.details}</p>
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              <span>Contact: {issue.contact}</span>
                              <span>Due: {issue.dueDate}</span>
                            </div>
                          </div>
                          <Badge className={`text-xs whitespace-nowrap ${issue.status === "Urgent" ? "bg-red-500/80" : "bg-amber-500/80"}`}>{issue.status}</Badge>
                        </div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {issue.status === "Pending" && (
                            <Button size="sm" onClick={() => handleSendReminder(issue.id)} className="h-8 text-xs bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Send Reminder</Button>
                          )}
                          {issue.status === "Urgent" && (
                            <Button size="sm" onClick={() => handleRequestUpdate(issue.id)} className="h-8 text-xs bg-red-500/20 text-red-500 hover:bg-red-500/30">Request Update</Button>
                          )}
                          <Button size="sm" onClick={() => handleViewComplianceDetails(issue)} variant="outline" className="h-8 text-xs cursor-pointer">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BILLING & PAYMENTS */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Billing & Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-white">$12,450</p>
                      <p className="text-xs text-green-500 mt-1">↑ 8% vs last month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-white">127</p>
                      <p className="text-xs text-muted-foreground mt-1">All plans combined</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Failed Payments</p>
                      <p className="text-2xl font-bold text-red-500">3</p>
                      <p className="text-xs text-red-500 mt-1">Action needed</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-border">
                    <CardContent className="pt-4">
                      <p className="text-xs font-bold text-primary mb-2">Avg Revenue/Sub</p>
                      <p className="text-2xl font-bold text-white">$42</p>
                      <p className="text-xs text-muted-foreground mt-1">Per provider</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-white font-bold text-sm mb-3">Active Provider Subscriptions</h3>
                    {[
                      { provider: "Recovery First LLC", plan: "Premium", status: "Active", renewDate: "Dec 10, 2024", amount: "$49/mo", contact: "admin@recoveryfirst.com", startDate: "Sep 10, 2024", paymentMethod: "Visa ending in 4242" },
                      { provider: "Hope House", plan: "Basic", status: "Active", renewDate: "Dec 22, 2024", amount: "$29/mo", contact: "contact@hopehouse.org", startDate: "Oct 22, 2024", paymentMethod: "Mastercard ending in 1234" },
                      { provider: "New Path Recovery", plan: "Premium", status: "Active", renewDate: "Dec 5, 2024", amount: "$49/mo", contact: "info@newpath.org", startDate: "Sep 5, 2024", paymentMethod: "Visa ending in 5678" },
                    ].map((sub, i) => (
                      <div key={i} className="p-4 rounded-lg bg-white/5 border border-border/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{sub.provider}</p>
                            <p className="text-xs text-muted-foreground">{sub.contact}</p>
                          </div>
                          <Badge className="bg-green-500/80 text-xs">{sub.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                          <div>
                            <p className="text-muted-foreground">Plan</p>
                            <p className="text-white font-semibold">{sub.plan}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="text-white font-semibold">{sub.amount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Started</p>
                            <p className="text-white font-semibold">{sub.startDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Renews</p>
                            <p className="text-white font-semibold">{sub.renewDate}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">Payment Method: <span className="text-white">{sub.paymentMethod}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-white font-bold text-sm mb-3">Failed Payments & Issues</h3>
                    {[
                      { provider: "Serenity House", plan: "Premium", amount: "$49", failDate: "Dec 3, 2024", reason: "Card declined", contact: "info@serenityhouse.org", status: "Awaiting update" },
                      { provider: "Pathway Recovery", plan: "Basic", amount: "$29", failDate: "Dec 1, 2024", reason: "Expired card", contact: "billing@pathwayrecovery.com", status: "Updated" },
                      { provider: "New Beginnings", plan: "Premium", amount: "$49", failDate: "Nov 28, 2024", reason: "Insufficient funds", contact: "admin@newbeginnings.org", status: "Retry pending" },
                    ].map((fail, i) => (
                      <div key={i} className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm">{fail.provider}</p>
                            <p className="text-xs text-muted-foreground">{fail.contact}</p>
                          </div>
                          <Badge className="bg-red-500/80 text-xs">{fail.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Plan</p>
                            <p className="text-white font-semibold">{fail.plan}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="text-white font-semibold">{fail.amount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Failure Date</p>
                            <p className="text-white font-semibold">{fail.failDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reason</p>
                            <p className="text-red-400 font-semibold">{fail.reason}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleSendPaymentReminder(fail.provider, fail.contact)}
                            className="h-7 text-xs bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                            data-testid={`button-send-reminder-${fail.provider.replace(/\s+/g, '_')}`}
                          >
                            Send Reminder
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleContactProvider(fail.provider, fail.contact)}
                            variant="outline" 
                            className="h-7 text-xs border-primary/30"
                            data-testid={`button-contact-provider-${fail.provider.replace(/\s+/g, '_')}`}
                          >
                            Contact Provider
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Conversion Rate</p>
                  <p className="text-3xl font-bold text-white">24%</p>
                  <p className="text-xs text-green-500 mt-2">↑ 3% vs last week</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">Avg. Response Time</p>
                  <p className="text-3xl font-bold text-white">4.2h</p>
                  <p className="text-xs text-muted-foreground mt-2">Provider to tenant</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">Platform Traffic</p>
                  <p className="text-3xl font-bold text-white">8.5k</p>
                  <p className="text-xs text-muted-foreground mt-2">Unique visitors this week</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, listing: "Downtown Recovery Center", views: 2840, applications: 12, rating: 4.8 },
                    { rank: 2, listing: "Hope House - Supportive Living", views: 2156, applications: 9, rating: 4.6 },
                    { rank: 3, listing: "New Path Recovery Home", views: 1932, applications: 7, rating: 4.7 },
                    { rank: 4, listing: "Serenity Sober Living", views: 1645, applications: 5, rating: 4.5 },
                    { rank: 5, listing: "Fresh Start Recovery", views: 1289, applications: 4, rating: 4.4 },
                  ].map((item) => (
                    <div key={item.rank} className="p-3 rounded-lg bg-white/5 border border-border/50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">#{item.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{item.listing}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{item.views.toLocaleString()} views</span>
                          <span className="text-xs text-primary">{item.applications} apps</span>
                          <span className="text-xs text-amber-500">★ {item.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUPPORT TICKETS */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">Open Tickets</p>
                  <p className="text-3xl font-bold text-white">{supportTickets.filter(t => t.status === "Open").length}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">In Progress</p>
                  <p className="text-3xl font-bold text-white">{supportTickets.filter(t => t.status === "In Progress").length}</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-xs font-bold text-primary mb-2">Resolved</p>
                  <p className="text-3xl font-bold text-white">{supportTickets.filter(t => t.status === "Resolved").length}</p>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className={`p-4 rounded-lg border ${
                      ticket.status === "Open" ? "bg-blue-500/10 border-blue-500/20" :
                      ticket.status === "In Progress" ? "bg-amber-500/10 border-amber-500/20" :
                      "bg-green-500/10 border-green-500/20"
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{ticket.id} • {ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">{ticket.user} • {ticket.created}</p>
                          <p className="text-sm text-gray-300 mt-2">{ticket.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Badge className={ticket.priority === "high" ? "bg-red-500/80" : ticket.priority === "medium" ? "bg-amber-500/80" : "bg-gray-500/80"}>{ticket.priority}</Badge>
                          <Badge className={ticket.status === "Open" ? "bg-blue-500/80" : ticket.status === "In Progress" ? "bg-amber-500/80" : "bg-green-500/80"}>{ticket.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {ticket.status === "Open" && (
                          <Button size="sm" onClick={() => setSupportTickets(supportTickets.map(t => t.id === ticket.id ? {...t, status: "In Progress"} : t))} className="h-8 text-xs bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Start</Button>
                        )}
                        {ticket.status === "In Progress" && (
                          <Button size="sm" onClick={() => setSupportTickets(supportTickets.map(t => t.id === ticket.id ? {...t, status: "Resolved"} : t))} className="h-8 text-xs bg-green-500/20 text-green-500 hover:bg-green-500/30">Resolve</Button>
                        )}
                        <Button size="sm" onClick={() => { setViewingSupportTicket(ticket); setShowReplyModal(true); }} variant="outline" className="h-8 text-xs">Reply</Button>
                        <Button size="sm" onClick={() => { setViewingSupportTicket(ticket); setShowSupportDetailsModal(true); }} variant="outline" className="h-8 text-xs">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMAIL SUBSCRIBER LIST */}
          <TabsContent value="email-list" className="space-y-6">
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Total Subscribers: {emailSubscribers.length}</p>
                  <p className="text-xs text-muted-foreground">All active subscribers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Active: {emailSubscribers.filter(s => s.status === "Active").length}</p>
                  <p className="text-xs text-muted-foreground">Actively receiving emails</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Growth Rate: +12%</p>
                  <p className="text-xs text-muted-foreground">Month over month</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Last 7 Days: +3</p>
                  <p className="text-xs text-muted-foreground">New subscriptions</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Subscriber List</h3>
              {emailSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-white font-medium">{subscriber.email}</p>
                    <p className="text-xs text-muted-foreground">Subscribed {subscriber.subscribeDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-500">{subscriber.status}</Badge>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Unsubscribe</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Subscription Waivers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">Grant providers exemption from the $49/month subscription fee for partnerships, promotions, or community benefits.</p>
                <div className="space-y-2">
                  {[
                    { provider: "Recovery First LLC", status: "Active Waiver", reason: "Partnership Agreement", until: "Permanent" },
                    { provider: "Hope House", status: "No Waiver", reason: "-", until: "-" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.provider}</p>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={item.status === "Active Waiver" ? "bg-green-500/80" : "bg-gray-600"}>{item.status}</Badge>
                        <Button onClick={() => handleWaiveSubscription(item.provider)} size="sm" variant="ghost" className="text-xs mt-2">
                          {item.status === "Active Waiver" ? "Manage" : "Grant Waiver"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Safety & Moderation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold">Application Requirements</h3>
                  {[
                    { field: "Photo ID", required: true },
                    { field: "Sobriety Status", required: true },
                    { field: "Treatment History", required: true },
                    { field: "Emergency Contact", required: true },
                    { field: "Insurance Info", required: false },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-border/50">
                      <span className="text-white text-sm">{req.field}</span>
                      <Badge className={req.required ? "bg-green-500/80" : "bg-gray-500/80"}>{req.required ? "Required" : "Optional"}</Badge>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-white font-bold">Safety Settings</h3>
                  <div className="space-y-2">
                    {safetySettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => toggleSafetySettings(setting.id)}>
                        <span className="text-white text-sm">{setting.label}</span>
                        <div className={`w-10 h-6 rounded-full ${setting.enabled ? "bg-primary" : "bg-gray-600"} transition-colors`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6 flex gap-2">
                  <Button onClick={handleSaveSettings} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                  <Button onClick={handleResetSettings} variant="outline">Reset to Default</Button>
                  <Button onClick={handleExportData} variant="ghost" className="text-red-500 hover:bg-red-500/10 ml-auto">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MARKETING */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                      <h3 className="text-3xl font-bold text-white">3</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email Open Rate</p>
                      <h3 className="text-3xl font-bold text-white">34%</h3>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lead Conversion</p>
                      <h3 className="text-3xl font-bold text-white">12.5%</h3>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No campaigns yet. Create your first campaign!</p>
                ) : (
                  campaigns.map((campaign, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{campaign.recipients} recipients</p>
                        </div>
                        <Badge className={campaign.status === "Active" ? "bg-green-500/80" : campaign.status === "Scheduled" ? "bg-blue-500/80" : "bg-gray-600"}>{campaign.status}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div><p className="text-muted-foreground">Sent</p><p className="text-white">{campaign.sent || "-"}</p></div>
                        <div><p className="text-muted-foreground">Opens</p><p className="text-white">{campaign.opens || "-"}</p></div>
                        <div><p className="text-muted-foreground">Clicks</p><p className="text-white">{campaign.clicks || "-"}</p></div>
                        <div className="flex gap-1">
                          <Button onClick={() => { setEmailSubject(campaign.name); setEmailBodyText(""); setShowEmailComposer(true); }} size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7 text-red-500" onClick={() => handleDeleteCampaign(i)}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button onClick={() => { setEmailSubject(""); setEmailBodyText(""); setShowEmailComposer(true); }} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-4">
                  <Plus className="w-4 h-4" /> Create Campaign
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5" /> Featured Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300">Promote provider listings to increase visibility and tenant applications.</p>
                {[
                  { provider: "Recovery First LLC", listing: "Downtown Recovery Center", boost: "2x Visibility", spent: "$98" },
                  { provider: "Hope House", listing: "Supportive Living Home", boost: "3x Visibility", spent: "$147" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.provider}</p>
                      <p className="text-xs text-muted-foreground">{item.listing}</p>
                      <p className="text-xs text-primary mt-1">{item.boost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{item.spent}</p>
                      <Button onClick={handleManageListing} size="sm" variant="outline" className="mt-2">Manage</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Marketing Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                  {[
                    { name: "Welcome New Providers", type: "Email", uses: 24 },
                    { name: "Recovery Success Stories", type: "Social Post", uses: 12 },
                    { name: "Available Listings Alert", type: "SMS", uses: 156 },
                    { name: "Testimonial Campaign", type: "Email", uses: 8 },
                    { name: "Property Compliance Reminder", type: "Email", uses: 42 },
                    { name: "Tenant Application Approved", type: "Email", uses: 67 },
                    { name: "Provider Subscription Renewal", type: "Email", uses: 89 },
                    { name: "Resource Updates Newsletter", type: "Email", uses: 34 },
                  ].map((template, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col">
                      <p className="text-white text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{template.type} • Used {template.uses} times</p>
                      <Button onClick={() => { setEmailSubject(template.name); setEmailBodyText(""); setShowEmailComposer(true); }} size="sm" variant="ghost" className="text-xs mt-2 self-start">Use Template</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email & SMS Marketing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Email & SMS Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Mass Email Campaign</p>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Recipient Group</label>
                        <select className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1">
                          <option>All Tenants</option>
                          <option>All Providers</option>
                          <option>Active Subscribers</option>
                          <option>Inactive Users</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Subject</label>
                        <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Email subject" className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1" />
                      </div>
                      <Button onClick={() => setShowEmailComposer(true)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2">Compose Email</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Automated Sequences</p>
                    <div className="space-y-2">
                      {["New Provider Onboarding (7 emails)", "Tenant Recovery Tips (Weekly)", "Renewal Reminders (7 days before)"].map((seq, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-xs text-gray-300">{seq}</span>
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-white font-semibold mb-2">SMS Marketing</p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Select Audience</label>
                      <select value={smsAudience} onChange={(e) => setSmsAudience(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1">
                        <option>All Users</option>
                        <option>All Tenants</option>
                        <option>All Providers</option>
                        <option>Active Users</option>
                        <option>Inactive Users</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="SMS message (160 characters max)" 
                      maxLength={160} 
                      value={smsContent}
                      onChange={(e) => setSmsContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm" 
                      rows={3} 
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{smsContent.length}/160 characters</span>
                      <Button onClick={handleSendSMS} className="bg-primary text-primary-foreground hover:bg-primary/90">Send SMS</Button>
                    </div>
                    {smsSentSuccess && (
                      <div className="mt-2 bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        SMS sent successfully to {smsAudience}!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automated Email Marketing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Automated Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Active Workflows</p>
                    <p className="text-2xl font-bold text-white">{automatedCampaigns.filter(c => c.active).length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Total Enrolled</p>
                    <p className="text-2xl font-bold text-primary">{automatedCampaigns.reduce((sum, c) => sum + c.enrolled, 0)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Emails Sent</p>
                    <p className="text-2xl font-bold text-green-400">2,847</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {automatedCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium">{campaign.name}</p>
                            <Badge className={campaign.active ? "bg-green-500/80" : "bg-gray-600"}>{campaign.active ? "Active" : "Inactive"}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>
                              <p className="text-muted-foreground">Trigger: {campaign.trigger}</p>
                              <p className="text-muted-foreground">Audience: {campaign.audience}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Emails: {campaign.emails}</p>
                              <p className="text-muted-foreground">Enrolled: {campaign.enrolled}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleToggleAutoCampaign(campaign.id)}
                            size="sm" 
                            variant="ghost" 
                            className="text-xs h-7"
                            data-testid={`button-toggle-campaign-${campaign.id}`}
                          >
                            {campaign.active ? "Pause" : "Resume"}
                          </Button>
                          <Button 
                            onClick={() => handleDeleteAutoCampaign(campaign.id)}
                            size="sm" 
                            variant="ghost" 
                            className="text-xs h-7 text-red-500"
                            data-testid={`button-delete-campaign-${campaign.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setShowNewAutoCampaignModal(true)} 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-4"
                  data-testid="button-create-automated-campaign"
                >
                  <Plus className="w-4 h-4" /> Create Automated Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Automated Campaign Creation Modal */}
            {showNewAutoCampaignModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-card border-border w-full max-w-md">
                  <CardHeader>
                    <CardTitle className="text-white">Create Automated Campaign</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Campaign Name</label>
                      <input 
                        type="text" 
                        value={newAutoCampaignName} 
                        onChange={(e) => setNewAutoCampaignName(e.target.value)}
                        placeholder="e.g., Welcome New Users" 
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1"
                        data-testid="input-campaign-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Trigger</label>
                      <select 
                        value={newAutoCampaignTrigger} 
                        onChange={(e) => setNewAutoCampaignTrigger(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1"
                        data-testid="select-trigger"
                      >
                        <option value="on-signup">On Signup</option>
                        <option value="weekly">Weekly</option>
                        <option value="on-purchase">On Purchase</option>
                        <option value="on-renewal">7 Days Before Renewal</option>
                        <option value="on-abandonment">On Abandonment</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Target Audience</label>
                      <select 
                        value={newAutoCampaignAudience} 
                        onChange={(e) => setNewAutoCampaignAudience(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1"
                        data-testid="select-audience"
                      >
                        <option value="tenants">All Tenants</option>
                        <option value="providers">All Providers</option>
                        <option value="new-users">New Users</option>
                        <option value="inactive">Inactive Users</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Number of Emails in Sequence</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="12"
                        value={newAutoCampaignEmails} 
                        onChange={(e) => setNewAutoCampaignEmails(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm mt-1"
                        data-testid="input-email-count"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={handleCreateAutomatedCampaign} 
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid="button-save-automated-campaign"
                      >
                        Create Campaign
                      </Button>
                      <Button 
                        onClick={() => setShowNewAutoCampaignModal(false)} 
                        variant="outline" 
                        className="flex-1"
                        data-testid="button-cancel-modal"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SEO Tools */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" /> SEO & Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Recovery Tips for New Residents", views: 2400, posts: 12, status: "Published" },
                    { title: "Understanding Sober Living", views: 1890, posts: 8, status: "Published" },
                    { title: "Finding the Right Recovery Home", views: 0, posts: 0, status: "Draft" },
                  ].map((blog, i) => (
                    <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{blog.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{blog.posts} articles</p>
                        </div>
                        <Badge className={blog.status === "Published" ? "bg-green-500/80" : "bg-gray-600"}>{blog.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-300 mb-3">{blog.views.toLocaleString()} views</div>
                      <div className="space-y-1">
                        <input type="text" placeholder="Meta description" className="w-full px-2 py-1 rounded text-xs bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white" />
                        <input type="text" placeholder="SEO keywords" className="w-full px-2 py-1 rounded text-xs bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => { setBlogTitle(blog.title); setBlogContent(""); setShowBlogEditor(true); }} size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                        <Button onClick={handlePublishBlog} size="sm" variant="ghost" className="text-xs h-7">Publish</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={handleCreateBlog} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Plus className="w-4 h-4" /> Create Blog Post
                </Button>
              </CardContent>
            </Card>

            {/* Promo Codes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Promo Codes & Discounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Active Promo Codes</p>
                    {[
                      { code: "WELCOME25", discount: "25% off", target: "New Providers", used: "34/100" },
                      { code: "RECOVERY20", discount: "20% off", target: "Tenants", used: "128/500" },
                    ].map((promo, i) => (
                      <div key={i} className="mb-2 p-2 bg-background/50 rounded text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-primary">{promo.code}</span>
                          <span className="text-gray-300">{promo.used}</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">{promo.discount} • {promo.target}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Create Promo Code</p>
                    <div className="space-y-2">
                      <input type="text" placeholder="Code (e.g., SUMMER30)" className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm" />
                      <select className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm">
                        <option>10% off subscription</option>
                        <option>25% off subscription</option>
                        <option>Free featured listing</option>
                        <option>Free 3x visibility boost</option>
                      </select>
                      <input type="number" placeholder="Limit (0 = unlimited)" className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm" />
                      <Button onClick={handleCreatePromo} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Create Code</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ad Management */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Ad Management & Featured Placements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Featured Home Placements</p>
                    <div className="space-y-2">
                      {[
                        { home: "Downtown Recovery Center", duration: "30 days", cost: "$199", status: "Active" },
                        { home: "Supportive Living Homes", duration: "7 days", cost: "$49", status: "Expiring Soon" },
                      ].map((ad, i) => (
                        <div key={i} className="p-2 bg-background/50 rounded-lg text-xs border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{ad.home}</span>
                            <Badge className={ad.status === "Active" ? "bg-green-500/80" : "bg-amber-500/80"}>{ad.status}</Badge>
                          </div>
                          <div className="text-gray-400">{ad.duration} • {ad.cost}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Sponsored Listings</p>
                    <div className="space-y-2">
                      {[
                        { boost: "2x Visibility", price: "$49/week", impressions: "~5,000" },
                        { boost: "3x Visibility", price: "$99/week", impressions: "~12,000" },
                        { boost: "Top Placement", price: "$149/week", impressions: "~20,000+" },
                      ].map((spot, i) => (
                        <div key={i} className="p-2 bg-background/50 rounded-lg text-xs border border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{spot.boost}</span>
                            <span className="text-primary">{spot.price}</span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1">{spot.impressions} estimated impressions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-white font-semibold mb-2">Launch New Ad Campaign</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select className="px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm">
                      <option>Select Ad Type</option>
                      <option>Featured Listing</option>
                      <option>Sponsored Placement</option>
                      <option>Promoted Home</option>
                    </select>
                    <input type="number" placeholder="Budget ($)" className="px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm" />
                    <Button onClick={handleLaunchAd} className="bg-primary text-primary-foreground hover:bg-primary/90 h-10">Launch</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleSaveMarketing} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Marketing Plan</Button>
              <Button onClick={handleDownloadReport} variant="outline">Download Report</Button>
            </div>
          </TabsContent>

          {/* WORKFLOWS & AUTOMATION */}
          <TabsContent value="workflows" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Email Workflow Builder
                  </CardTitle>
                  <Button onClick={() => setShowWorkflowModal(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Plus className="w-4 h-4" /> Create Workflow
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300 mb-6">Automate email sequences and tenant/provider communications with intelligent workflows.</p>
                
                {workflows.length === 0 ? (
                  <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10 border-dashed">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No workflows yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Create your first automated email workflow</p>
                    <Button onClick={() => setShowWorkflowModal(true)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Create Workflow</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workflows.map((workflow, i) => (
                      <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{workflow.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Trigger: {workflow.trigger} • Template: {workflow.template} • Status: {workflow.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-xs">Edit</Button>
                          <Button size="sm" variant="ghost" className="h-8 text-xs text-red-500">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "welcome", name: "Welcome Series", desc: "3-email welcome sequence for new tenants", emails: 3 },
                  { id: "provider-onboard", name: "Provider Onboarding", desc: "Complete setup guide for new providers", emails: 5 },
                  { id: "app-approved", name: "Application Approved", desc: "Notify tenant after successful application", emails: 1 },
                  { id: "renewal-reminder", name: "Renewal Reminder", desc: "Remind providers about subscription renewal", emails: 2 },
                  { id: "success-story", name: "Success Stories", desc: "Share recovery testimonials monthly", emails: 4 },
                ].map((template) => (
                  <div key={template.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:border-primary/30 transition-colors">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{template.desc}</p>
                      <p className="text-xs text-primary mt-1">{template.emails} emails</p>
                    </div>
                    <Button onClick={() => { setNewWorkflowTemplate(template.id); setShowWorkflowModal(true); }} size="sm" variant="outline" className="h-8 text-xs">Use Template</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Workflow Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground">Workflows created this month</span>
                    <span className="text-white font-bold">{workflows.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground">Total emails sent via workflows</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-muted-foreground">Average open rate</span>
                    <span className="text-white font-bold">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showWorkflowModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
              <h2 className="text-xl font-bold text-white mb-4">Create Email Workflow</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Workflow Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., New Tenant Onboarding" 
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Workflow Trigger</label>
                  <select 
                    value={newWorkflowTrigger}
                    onChange={(e) => setNewWorkflowTrigger(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                  >
                    <option value="onSignup">On User Signup</option>
                    <option value="onApplicationApproved">Application Approved</option>
                    <option value="onApplicationSubmitted">Application Submitted</option>
                    <option value="onSubscriptionRenewal">Subscription Renewal</option>
                    <option value="onInactivity">30 Days Inactive</option>
                    <option value="manual">Manual Send</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email Template</label>
                  <select 
                    value={newWorkflowTemplate}
                    onChange={(e) => setNewWorkflowTemplate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                  >
                    <option value="welcome">Welcome Series</option>
                    <option value="provider-onboard">Provider Onboarding</option>
                    <option value="app-approved">Application Approved</option>
                    <option value="renewal-reminder">Renewal Reminder</option>
                    <option value="success-story">Success Stories</option>
                    <option value="blank">Blank Template</option>
                  </select>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email Subject Line</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Welcome to Sober Stay!" 
                    value={newWorkflowSubject}
                    onChange={(e) => setNewWorkflowSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This is what recipients see in their inbox</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email Content</label>
                  <textarea 
                    placeholder="Write your email content here. You can use HTML or plain text. Variables: [name], [email], [role], [property]" 
                    value={newWorkflowBody}
                    onChange={(e) => setNewWorkflowBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm font-mono"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use [variable] syntax to personalize emails. Supports HTML formatting.</p>
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary font-medium">Preview: This workflow will send emails when a user {newWorkflowTrigger === 'onSignup' ? 'signs up' : newWorkflowTrigger === 'onApplicationApproved' ? 'has an approved application' : 'triggers this event'}.</p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={() => {
                    if (newWorkflowName.trim() && newWorkflowSubject.trim() && newWorkflowBody.trim()) {
                      setWorkflows([...workflows, { 
                        name: newWorkflowName, 
                        trigger: newWorkflowTrigger, 
                        template: newWorkflowTemplate,
                        subject: newWorkflowSubject,
                        body: newWorkflowBody,
                        status: "Active",
                        created: new Date().toLocaleDateString()
                      }]);
                      setShowWorkflowModal(false);
                      setNewWorkflowName("");
                      setNewWorkflowSubject("");
                      setNewWorkflowBody("");
                    }
                  }} 
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Create Workflow
                </Button>
                <Button 
                  onClick={() => {
                    setShowWorkflowModal(false);
                    setNewWorkflowName("");
                    setNewWorkflowSubject("");
                    setNewWorkflowBody("");
                  }} 
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {editingUser && (
          <UserEditModal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={editingUser}
            onSave={handleSaveUser}
          />
        )}

        {reviewingListing && (
          <ListingReviewModal
            open={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            listing={reviewingListing}
            onApprove={handleApproveListing}
            onDeny={handleDenyListing}
          />
        )}

        {viewingApplication && (
          <ApplicationDetailsModal
            open={showApplicationModal}
            onClose={() => {
              setShowApplicationModal(false);
              setViewingApplication(null);
            }}
            application={viewingApplication}
            onApprove={handleApproveApplication}
            onDeny={handleDenyApplication}
          />
        )}

        {/* Document Preview Modal */}
        {showDocumentPreviewModal && viewingDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Document Preview
                </h2>
                <Button size="sm" variant="ghost" onClick={() => {
                  setShowDocumentPreviewModal(false);
                  setViewingDocument(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Document Name</p>
                    <p className="text-white font-medium">{viewingDocument.documentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Document Type</p>
                    <p className="text-white">{viewingDocument.documentType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="text-white">{viewingDocument.provider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-white">{viewingDocument.providerEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-white">{new Date(viewingDocument.uploadedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className={
                      viewingDocument.status === "Approved" ? "bg-green-500/80" :
                      viewingDocument.status === "Rejected" ? "bg-red-500/80" :
                      viewingDocument.status === "More Info Requested" ? "bg-blue-500/80" :
                      "bg-amber-500/80"
                    }>{viewingDocument.status}</Badge>
                  </div>
                </div>
                
                {/* Document Preview Area */}
                <div className="border border-white/10 rounded-lg p-8 bg-white/5 min-h-64 flex flex-col items-center justify-center">
                  <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-white font-medium mb-2">{viewingDocument.documentName}</p>
                  <p className="text-muted-foreground text-sm mb-4">{viewingDocument.fileSize || "PDF Document"}</p>
                  <Button type="button" onClick={() => handleDownloadDocument(viewingDocument)} variant="outline" className="gap-2" data-testid="button-download-document">
                    <Download className="w-4 h-4" /> Download to View Full Document
                  </Button>
                </div>
              </div>
              
              {viewingDocument.status === "Pending Review" && (
                <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
                  <Button onClick={() => handleApproveDocument(viewingDocument.id)} className="flex-1 bg-green-600 hover:bg-green-700 gap-2">
                    <Check className="w-4 h-4" /> Verify Document
                  </Button>
                  <Button onClick={() => {
                    setShowDocumentPreviewModal(false);
                    openDenyModal(viewingDocument);
                  }} variant="outline" className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 gap-2">
                    <X className="w-4 h-4" /> Deny
                  </Button>
                  <Button onClick={() => {
                    setShowDocumentPreviewModal(false);
                    openRequestInfoModal(viewingDocument);
                  }} variant="outline" className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-2">
                    <MessageSquare className="w-4 h-4" /> Request Info
                  </Button>
                </div>
              )}
              
              {viewingDocument.status !== "Pending Review" && (
                <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
                  <Button onClick={() => {
                    setShowDocumentPreviewModal(false);
                    setViewingDocument(null);
                  }} variant="outline" className="w-full">
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deny Document Modal */}
        {showDenyDocumentModal && viewingDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" /> Deny Document
              </h2>
              <p className="text-muted-foreground mb-4">
                You are denying: <span className="text-white font-medium">{viewingDocument.documentName}</span> from {viewingDocument.provider}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Select Denial Reason *</label>
                  <select
                    value={denyDocumentReason}
                    onChange={(e) => setDenyDocumentReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                  >
                    <option value="">Choose a reason...</option>
                    {documentDenialReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleRejectDocument(viewingDocument.id)} 
                  disabled={!denyDocumentReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                >
                  <X className="w-4 h-4" /> Confirm Denial
                </Button>
                <Button onClick={() => {
                  setShowDenyDocumentModal(false);
                  setDenyDocumentReason("");
                  setViewingDocument(null);
                }} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Request More Info Modal */}
        {showRequestInfoModal && viewingDocument && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" /> Request More Information
              </h2>
              <p className="text-muted-foreground mb-4">
                Request additional information for: <span className="text-white font-medium">{viewingDocument.documentName}</span> from {viewingDocument.provider}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">What information do you need? *</label>
                  <textarea
                    placeholder="Please specify what additional information or documents are needed..."
                    value={requestInfoMessage}
                    onChange={(e) => setRequestInfoMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white h-24"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleRequestDocumentInfo(viewingDocument.id)} 
                  disabled={!requestInfoMessage.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Send Request
                </Button>
                <Button onClick={() => {
                  setShowRequestInfoModal(false);
                  setRequestInfoMessage("");
                  setViewingDocument(null);
                }} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showBlogModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Content Editor</h2>
                <div className="flex items-center gap-3">
                  {blogAutoSaved && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Save className="w-3 h-3" /> Auto-saved
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {getWordCount(blogContent)} words • {getReadTime(getWordCount(blogContent))}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Post Title *</label>
                    <input 
                      type="text" 
                      placeholder="Enter an engaging title..." 
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        if (!blogSlug) setBlogSlug(generateSlug(e.target.value));
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-lg font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Author</label>
                    <input 
                      type="text" 
                      placeholder="Author name" 
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Excerpt (Summary for previews)</label>
                  <textarea 
                    placeholder="Write a brief summary that will appear in article previews..." 
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white h-16"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Category</label>
                    <select 
                      value={blogCategory} 
                      onChange={(e) => setBlogCategory(e.target.value)} 
                      className="w-full px-2 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                    >
                      <option>Recovery Tips</option>
                      <option>Education</option>
                      <option>Community</option>
                      <option>Guidance</option>
                      <option>Mental Health</option>
                      <option>Stories</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Font</label>
                    <select 
                      value={blogFont} 
                      onChange={(e) => setBlogFont(e.target.value)} 
                      className="w-full px-2 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-xs"
                    >
                      <option>Georgia</option>
                      <option>Arial</option>
                      <option>Times New Roman</option>
                      <option>Verdana</option>
                      <option>Inter</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Size</label>
                    <select 
                      value={blogFontSize} 
                      onChange={(e) => setBlogFontSize(Number(e.target.value))} 
                      className="w-full px-2 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-xs"
                    >
                      <option value={14}>Small</option>
                      <option value={16}>Medium</option>
                      <option value={18}>Large</option>
                      <option value={20}>X-Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Text Color</label>
                    <input 
                      type="color" 
                      value={blogFontColor} 
                      onChange={(e) => setBlogFontColor(e.target.value)} 
                      className="w-full h-9 rounded-lg cursor-pointer bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Schedule</label>
                    <input 
                      type="date" 
                      value={blogScheduleDate}
                      onChange={(e) => setBlogScheduleDate(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-xs"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Tags (comma-separated)</label>
                    <input 
                      type="text" 
                      placeholder="recovery, sobriety, mental health..." 
                      value={blogTags}
                      onChange={(e) => setBlogTags(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">URL Slug</label>
                    <input 
                      type="text" 
                      placeholder="custom-url-slug" 
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Content *</label>
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-background/30 border-b border-white/10">
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("**")} className="h-8 w-8 p-0" title="Bold">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("*")} className="h-8 w-8 p-0" title="Italic">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("~~")} className="h-8 w-8 p-0" title="Strikethrough">
                        <Strikethrough className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("# ", "")} className="h-8 w-8 p-0" title="Heading 1">
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("## ", "")} className="h-8 w-8 p-0" title="Heading 2">
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("- ", "")} className="h-8 w-8 p-0" title="Bullet List">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("1. ", "")} className="h-8 w-8 p-0" title="Numbered List">
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("> ", "")} className="h-8 w-8 p-0" title="Quote">
                        <Quote className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("[", "](url)")} className="h-8 w-8 p-0" title="Link">
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <div className="flex-1" />
                      <span className="text-xs text-muted-foreground px-2">Markdown supported</span>
                    </div>
                    <textarea 
                      id="blog-content-textarea"
                      placeholder="Start writing your content here...

Use the toolbar above for formatting, or write in Markdown:
• **bold** for bold text
• *italic* for italic text
• # Heading for headings
• - item for bullet lists
• > quote for blockquotes" 
                      value={blogContent}
                      onChange={(e) => {
                        setBlogContent(e.target.value);
                        autoSaveDraft(e.target.value, blogTitle);
                      }}
                      className="w-full px-4 py-4 bg-background/50 text-white h-64 resize-none border-0 focus:outline-none focus:ring-0"
                      style={{ fontFamily: blogFont, fontSize: `${blogFontSize}px`, color: blogFontColor }}
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">Live Preview</p>
                    {blogCategory && (
                      <Badge className="bg-primary/20 text-primary text-xs">{blogCategory}</Badge>
                    )}
                  </div>
                  <div className="p-6 bg-card rounded-lg border border-white/10 min-h-32">
                    <h3 className="font-bold text-2xl text-white mb-2">{blogTitle || "Your title here..."}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span>{blogAuthor || "Author"}</span>
                      <span>•</span>
                      <span>{blogScheduleDate ? new Date(blogScheduleDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{getReadTime(getWordCount(blogContent))}</span>
                    </div>
                    {blogExcerpt && (
                      <p className="text-muted-foreground italic mb-4">{blogExcerpt}</p>
                    )}
                    <div 
                      className="prose prose-invert max-w-none whitespace-pre-wrap"
                      style={{ fontFamily: blogFont, fontSize: `${blogFontSize}px`, color: blogFontColor }}
                    >
                      {blogContent || "Your blog content will appear here..."}
                    </div>
                    {blogTags && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                        {blogTags.split(",").map((tag, i) => (
                          <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Button onClick={handleSaveBlog} className="flex-1 bg-gray-600 hover:bg-gray-700 gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
                <Button onClick={handlePublishBlog} className="flex-1 bg-green-600 hover:bg-green-700 gap-2">
                  <CheckCircle className="w-4 h-4" /> {blogScheduleDate ? "Schedule" : "Publish Now"}
                </Button>
                <Button onClick={() => setShowBlogModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showNewCampaignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Create New Campaign</h2>
              <input 
                type="text" 
                placeholder="Campaign name" 
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mb-3"
              />
              <label className="text-xs text-muted-foreground">Recipient Group</label>
              <select 
                value={newCampaignRecipients}
                onChange={(e) => setNewCampaignRecipients(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mb-4 text-sm"
              >
                <option>All Tenants</option>
                <option>All Providers</option>
                <option>Active Subscribers</option>
                <option>Inactive Users</option>
              </select>
              <div className="flex gap-2">
                <Button onClick={handleSaveNewCampaign} className="flex-1 bg-primary hover:bg-primary/90">Create</Button>
                <Button onClick={() => setShowNewCampaignModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {editingCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">Edit Campaign</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Campaign Name</label>
                  <input 
                    type="text" 
                    defaultValue={editingCampaign.name}
                    id="campaign-name"
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select id="campaign-status" className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white" defaultValue={editingCampaign.status}>
                    <option>Active</option>
                    <option>Scheduled</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Recipients: {editingCampaign.recipients}</label>
                  <select id="campaign-recipients" className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mt-1">
                    <option>All Tenants</option>
                    <option>All Providers</option>
                    <option>Active Subscribers</option>
                    <option>Inactive Users</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Subject/Preview</label>
                  <input type="text" placeholder="Email subject" className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleSaveCampaign({ name: (document.getElementById("campaign-name") as HTMLInputElement)?.value, status: (document.getElementById("campaign-status") as HTMLSelectElement)?.value })} className="flex-1 bg-primary hover:bg-primary/90">Save</Button>
                <Button onClick={() => setEditingCampaign(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {editingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Manage Featured Listing</h2>
              <p className="text-white mb-2">{editingListing.provider}</p>
              <p className="text-gray-400 mb-4 text-sm">{editingListing.listing}</p>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground">Boost Level</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mt-1">
                    <option>2x Visibility - $49/week</option>
                    <option>3x Visibility - $99/week</option>
                    <option>Top Placement - $149/week</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Duration</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mt-1">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCloseListing} className="flex-1 bg-primary hover:bg-primary/90">Apply</Button>
                <Button onClick={() => setEditingListing(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showSupportDetailsModal && viewingSupportTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Ticket Details</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                  <p className="text-white font-medium">{viewingSupportTicket.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">From</p>
                  <p className="text-white font-medium">{viewingSupportTicket.user}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Subject</p>
                  <p className="text-white font-medium">{viewingSupportTicket.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <div className="bg-white/5 border border-white/10 p-3 rounded">
                    <p className="text-sm text-white">{viewingSupportTicket.message}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={
                    viewingSupportTicket.status === "Open" ? "bg-blue-500/80" :
                    viewingSupportTicket.status === "In Progress" ? "bg-amber-500/80" :
                    "bg-green-500/80"
                  }>{viewingSupportTicket.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowSupportDetailsModal(false)} className="flex-1 bg-primary hover:bg-primary/90">Close</Button>
              </div>
            </div>
          </div>
        )}

        {showReplyModal && viewingSupportTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Reply to {viewingSupportTicket.id}</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Message</label>
                  <textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-sm"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { setShowReplyModal(false); setReplyMessage(""); }} className="flex-1 bg-primary hover:bg-primary/90">Send Reply</Button>
                <Button onClick={() => { setShowReplyModal(false); setReplyMessage(""); }} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showBlogEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Blog Post</h2>
                <div className="flex items-center gap-3">
                  {blogAutoSaved && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Save className="w-3 h-3" /> Auto-saved
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {getWordCount(blogContent)} words • {getReadTime(getWordCount(blogContent))}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Post Title *</label>
                    <input 
                      type="text" 
                      placeholder="Enter an engaging title..." 
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        if (!blogSlug) setBlogSlug(generateSlug(e.target.value));
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white text-lg font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Author</label>
                    <input 
                      type="text" 
                      placeholder="Author name" 
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Content *</label>
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-background/30 border-b border-white/10">
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("**")} className="h-8 w-8 p-0" title="Bold">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("*")} className="h-8 w-8 p-0" title="Italic">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("~~")} className="h-8 w-8 p-0" title="Strikethrough">
                        <Strikethrough className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("# ", "")} className="h-8 w-8 p-0" title="Heading 1">
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("## ", "")} className="h-8 w-8 p-0" title="Heading 2">
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("- ", "")} className="h-8 w-8 p-0" title="Bullet List">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("1. ", "")} className="h-8 w-8 p-0" title="Numbered List">
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("> ", "")} className="h-8 w-8 p-0" title="Quote">
                        <Quote className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("[", "](url)")} className="h-8 w-8 p-0" title="Link">
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <div className="flex-1" />
                      <span className="text-xs text-muted-foreground px-2">Markdown supported</span>
                    </div>
                    <textarea 
                      id="blog-content-textarea-edit"
                      placeholder="Start writing your content here..." 
                      value={blogContent}
                      onChange={(e) => {
                        setBlogContent(e.target.value);
                        autoSaveDraft(e.target.value, blogTitle);
                      }}
                      className="w-full px-4 py-4 bg-background/50 text-white h-64 resize-none border-0 focus:outline-none focus:ring-0"
                      style={{ fontFamily: blogFont, fontSize: `${blogFontSize}px`, color: blogFontColor }}
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-muted-foreground mb-2">Live Preview</p>
                  <div className="p-6 bg-card rounded-lg border border-white/10 min-h-32">
                    <h3 className="font-bold text-2xl text-white mb-2">{blogTitle || "Your title here..."}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span>{blogAuthor || "Author"}</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{getReadTime(getWordCount(blogContent))}</span>
                    </div>
                    <div 
                      className="prose prose-invert max-w-none whitespace-pre-wrap"
                      style={{ fontFamily: blogFont, fontSize: `${blogFontSize}px`, color: blogFontColor }}
                    >
                      {blogContent || "Your blog content will appear here..."}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <Button onClick={handleSaveBlog} className="flex-1 bg-gray-600 hover:bg-gray-700 gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
                <Button onClick={handlePublishBlog} className="flex-1 bg-green-600 hover:bg-green-700 gap-2">
                  <CheckCircle className="w-4 h-4" /> Publish Now
                </Button>
                <Button onClick={() => setShowBlogEditor(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showEmailComposer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Email Composer</h2>
                <p className="text-xs text-muted-foreground mt-1">Design professional email campaigns</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Email Subject</label>
                  <input 
                    type="text" 
                    value={emailSubject} 
                    onChange={(e) => setEmailSubject(e.target.value)} 
                    placeholder="Enter compelling subject line..." 
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    data-testid="input-email-subject"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Font</label>
                    <select 
                      value={emailFont} 
                      onChange={(e) => setEmailFont(e.target.value)} 
                      className="w-full px-3 py-2 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
                      data-testid="select-font"
                    >
                      <option>Arial</option>
                      <option>Georgia</option>
                      <option>Verdana</option>
                      <option>Trebuchet MS</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Size</label>
                    <select 
                      value={emailFontSize} 
                      onChange={(e) => setEmailFontSize(Number(e.target.value))} 
                      className="w-full px-3 py-2 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
                      data-testid="select-size"
                    >
                      <option value={14}>14px</option>
                      <option value={16}>16px</option>
                      <option value={18}>18px</option>
                      <option value={20}>20px</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Text Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={emailFontColor} 
                        onChange={(e) => setEmailFontColor(e.target.value)} 
                        className="w-full h-10 rounded-lg cursor-pointer bg-background/80 border border-primary/30 hover:border-primary/50 transition-colors"
                        data-testid="input-color"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Preview</label>
                    <div className="w-full h-10 rounded-lg bg-background/80 border border-primary/30 flex items-center px-3 text-center" style={{ fontSize: `${emailFontSize * 0.65}px`, fontFamily: emailFont, color: emailFontColor }}>
                      Abc
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Email Content</label>
                  <textarea
                    placeholder="Write your email message here. Keep it engaging and concise..."
                    value={emailBodyText}
                    onChange={(e) => setEmailBodyText(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors resize-none"
                    rows={8}
                    style={{ fontFamily: emailFont, fontSize: `${emailFontSize}px`, color: emailFontColor }}
                    data-testid="textarea-content"
                  />
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Live Preview</p>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10 min-h-32 max-h-40 overflow-auto" style={{ fontFamily: emailFont, fontSize: `${emailFontSize}px`, color: emailFontColor, lineHeight: "1.6" }}>
                    {emailBodyText || "Your email content will appear here..."}
                  </div>
                </div>
              </div>
              
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2 justify-end">
                <Button 
                  onClick={() => setShowEmailComposer(false)} 
                  variant="outline"
                  data-testid="button-cancel-email"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => { setShowEmailComposer(false); handleSendCampaign(); toast({ title: "Campaign Sent", description: "Email campaign sent successfully!" }); }} 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-send-email"
                >
                  Send Campaign
                </Button>
              </div>
            </div>
          </div>
        )}

        {showComplianceDetailsModal && viewingComplianceIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Compliance Issue Details</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Provider</p>
                  <p className="text-white font-medium">{viewingComplianceIssue.provider}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issue</p>
                  <p className="text-white font-medium">{viewingComplianceIssue.issue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Status</p>
                  <Badge className={`${
                    viewingComplianceIssue.status === "Urgent" ? "bg-red-500/80" :
                    viewingComplianceIssue.status === "Reminder Sent" ? "bg-green-500/80" :
                    viewingComplianceIssue.status === "Update Requested" ? "bg-green-500/80" :
                    "bg-amber-500/80"
                  }`}>{viewingComplianceIssue.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Details</p>
                  <p className="text-sm text-gray-300">
                    {viewingComplianceIssue.issue.includes("Fire") 
                      ? "Property inspection is required annually. The last fire inspection was conducted 90 days ago and is due for renewal. Contact the provider to schedule the inspection immediately."
                      : "The provider's insurance certificate expired on November 15, 2024. An updated and valid certificate must be uploaded within 48 hours to maintain compliance and active listing status."}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Required Action</p>
                  <p className="text-sm text-white">
                    {viewingComplianceIssue.status === "Pending" 
                      ? "Send a reminder email to the provider requesting immediate compliance."
                      : viewingComplianceIssue.status === "Urgent"
                      ? "Request updated documentation from the provider immediately. Consider suspension if not resolved within 48 hours."
                      : "Monitor for compliance. Documentation has been requested."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowComplianceDetailsModal(false)} className="flex-1 bg-primary hover:bg-primary/90">Close</Button>
              </div>
            </div>
          </div>
        )}

        {showSubscriptionWaiverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-white mb-4">Waive Monthly Subscription</h2>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-200">Admin Action: This provider will be exempt from the $49/month subscription fee.</p>
              </div>
              <p className="text-white mb-4">Provider: <span className="font-semibold">{waivingProvider}</span></p>
              <div className="space-y-2 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground">Reason for Waiver</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mt-1">
                    <option>Partnership Agreement</option>
                    <option>Promotional Period</option>
                    <option>Community Benefit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Duration</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-background/60 border-2 border-primary/40 hover:border-primary/60 focus:border-primary focus:outline-none transition-all text-white mt-1">
                    <option>Permanent</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>1 Year</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfirmWaiver} className="flex-1 bg-primary hover:bg-primary/90">Confirm Waiver</Button>
                <Button onClick={() => setShowSubscriptionWaiverModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
