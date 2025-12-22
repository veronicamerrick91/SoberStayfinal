import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, Building, FileText, Activity, 
  Check, X, Eye, EyeOff, ShieldAlert, BarChart3, AlertTriangle,
  Mail, MessageSquare, Settings, DollarSign, TrendingUp,
  Search, Download, Flag, Lock, Clock, Upload, Shield, Plus,
  CheckCircle, Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, Heading1, Heading2, Link2, Quote, 
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Save,
  ChevronRight, RotateCcw, Trash2
} from "lucide-react";
import { getReports, updateReportStatus } from "@/lib/reports";
import { UserEditModal } from "@/components/user-edit-modal";
import { ListingReviewModal } from "@/components/listing-review-modal";
import { ApplicationDetailsModal } from "@/components/application-details-modal";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAuth, isAuthenticated } from "@/lib/auth";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  role: "Tenant" | "Provider";
  email: string;
  phone?: string;
  status: "Active" | "Suspended" | "Pending";
  verified: boolean;
  documentsVerified?: boolean;
  hasFeeWaiver?: boolean;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
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
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<any[]>([]);
  const [adminFeaturedListings, setAdminFeaturedListings] = useState<any[]>([]);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscountType, setNewPromoDiscountType] = useState("percent");
  const [newPromoDiscountValue, setNewPromoDiscountValue] = useState("");
  const [newPromoTarget, setNewPromoTarget] = useState("all");
  const [newPromoLimit, setNewPromoLimit] = useState("");
  const [newPromoActive, setNewPromoActive] = useState(true);
  const [newPromoExpiry, setNewPromoExpiry] = useState("");
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
  const [waiverSearchEmail, setWaiverSearchEmail] = useState("");
  const [waiverReason, setWaiverReason] = useState("");
  const [waiverDuration, setWaiverDuration] = useState("permanent");
  const [waivedProviders, setWaivedProviders] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState("onSignup");
  const [newWorkflowTemplate, setNewWorkflowTemplate] = useState("welcome");
  const [newWorkflowSubject, setNewWorkflowSubject] = useState("");
  const [newWorkflowBody, setNewWorkflowBody] = useState("");
  const [incidentReports, setIncidentReports] = useState<any[]>([]);
  const [complianceIssues, setComplianceIssues] = useState<any[]>([]);
  const [viewingComplianceIssue, setViewingComplianceIssue] = useState<any | null>(null);
  const [showComplianceDetailsModal, setShowComplianceDetailsModal] = useState(false);
  const [requiredDocs, setRequiredDocs] = useState<any[]>([
    { id: 1, name: "Business License", uploaded: false },
    { id: 2, name: "Insurance Certificate", uploaded: false },
    { id: 3, name: "Facility Photos", uploaded: false },
    { id: 4, name: "Safety Compliance Report", uploaded: false },
    { id: 5, name: "Property Inspection Report", uploaded: false }
  ]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const newTicketsCount = supportTickets.filter(t => t.status === "Open").length;
  const [viewingSupportTicket, setViewingSupportTicket] = useState<any | null>(null);
  const [showSupportDetailsModal, setShowSupportDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [newUsers, setNewUsers] = useState(0);
  const [newListings, setNewListings] = useState(0);
  const [newApplications, setNewApplications] = useState(0);
  const [newVerifications, setNewVerifications] = useState(0);
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
  const [emailRecipientGroup, setEmailRecipientGroup] = useState("all");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
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
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateType, setNewTemplateType] = useState("Email");
  const [newTemplateTrigger, setNewTemplateTrigger] = useState("none");
  const [newTemplateAudience, setNewTemplateAudience] = useState("all");
  const [newTemplateSubject, setNewTemplateSubject] = useState("");
  const [newTemplateBody, setNewTemplateBody] = useState("");
  const [marketingTemplates, setMarketingTemplates] = useState([
    { id: 1, name: "Welcome New Providers", type: "Email", uses: 24, trigger: "none", audience: "providers", subject: "Welcome to Sober Stay!", body: "Hi [name],\n\nWelcome to Sober Stay! We're excited to have you as a provider on our platform." },
    { id: 2, name: "Recovery Success Stories", type: "Email", uses: 12, trigger: "none", audience: "all", subject: "Inspiring Recovery Stories This Month", body: "This month, we're sharing inspiring stories from our community..." },
    { id: 3, name: "Available Listings Alert", type: "Email", uses: 156, trigger: "none", audience: "tenants", subject: "New Listings Available Near You", body: "Hi [name],\n\nWe found new sober living homes that match your preferences." },
    { id: 4, name: "Testimonial Campaign", type: "Email", uses: 8, trigger: "none", audience: "all", subject: "Share Your Recovery Journey", body: "Hi [name],\n\nYour story could inspire others. Would you share your experience?" },
    { id: 5, name: "Property Compliance Reminder", type: "Email", uses: 42, trigger: "monthly", audience: "providers", subject: "Monthly Compliance Check", body: "Hi [name],\n\nThis is your monthly reminder to review your property compliance documentation." },
    { id: 6, name: "Tenant Application Approved", type: "Email", uses: 67, trigger: "on-application-approved", audience: "tenants", subject: "Great News - Your Application Was Approved!", body: "Hi [name],\n\nCongratulations! Your application for [property] has been approved." },
    { id: 7, name: "Provider Subscription Renewal", type: "Email", uses: 89, trigger: "7-days-before-renewal", audience: "providers", subject: "Your Subscription Renews Soon", body: "Hi [name],\n\nYour subscription renews in 7 days. Review your plan details." },
    { id: 8, name: "Resource Updates Newsletter", type: "Email", uses: 34, trigger: "weekly", audience: "all", subject: "Weekly Recovery Resources", body: "Hi [name],\n\nHere are this week's helpful resources for your recovery journey." },
  ]);
  const [emailSubscribers, setEmailSubscribers] = useState<any[]>([]);
  const [showComposeEmailModal, setShowComposeEmailModal] = useState(false);
  const [composeEmailSubject, setComposeEmailSubject] = useState("");
  const [composeEmailBody, setComposeEmailBody] = useState("");
  const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCategory, setBlogCategory] = useState("Recovery Tips");
  const [blogFont, setBlogFont] = useState("Georgia");
  const [blogFontSize, setBlogFontSize] = useState(16);
  const [blogFontColor, setBlogFontColor] = useState("#ffffff");
  const [publishedBlogPosts, setPublishedBlogPosts] = useState<any[]>([]);
  const [databaseBlogPosts, setDatabaseBlogPosts] = useState<any[]>([]);
  const [editingBlogPostId, setEditingBlogPostId] = useState<number | null>(null);
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
  const [expandedSequence, setExpandedSequence] = useState<string | null>(null);
  const [showSequenceEmailEditor, setShowSequenceEmailEditor] = useState(false);
  const [editingSequenceEmail, setEditingSequenceEmail] = useState<any | null>(null);
  const [sequenceEmailSubject, setSequenceEmailSubject] = useState("");
  const [sequenceEmailBody, setSequenceEmailBody] = useState("");
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<{ subject: string; body: string } | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerCategory, setPartnerCategory] = useState("organization");
  const [partnerDescription, setPartnerDescription] = useState("");
  const [partnerWebsite, setPartnerWebsite] = useState("");
  const [partnerFocus, setPartnerFocus] = useState<string[]>([]);
  const [partnerIsActive, setPartnerIsActive] = useState(true);
  const [emailSequences, setEmailSequences] = useState([
    {
      id: "provider-onboarding",
      name: "New Provider Onboarding",
      emailCount: 7,
      active: true,
      emails: [
        { id: 1, day: 0, subject: "Welcome to Sober Stay!", body: "Hi [name],\n\nWelcome to Sober Stay! We're thrilled to have you join our network of trusted sober living providers.\n\nYour decision to offer recovery housing makes a real difference in people's lives. We're here to help you connect with individuals seeking a supportive environment for their recovery journey.\n\nHere's what you can do right now:\n- Complete your provider profile\n- Add your first property listing\n- Set your availability preferences\n\nIf you have any questions, our support team is here to help.\n\nWarm regards,\nThe Sober Stay Team" },
        { id: 2, day: 1, subject: "Complete Your Profile to Attract More Tenants", body: "Hi [name],\n\nA complete profile builds trust with potential tenants. Providers with fully completed profiles receive 3x more inquiries!\n\nHere's what to add:\n- A professional photo or logo\n- Your background and experience in recovery housing\n- Certifications or accreditations\n- Contact preferences\n\nLog in to your dashboard to complete your profile today.\n\nBest,\nThe Sober Stay Team" },
        { id: 3, day: 3, subject: "Ready to Add Your First Listing?", body: "Hi [name],\n\nIt's time to showcase your property! Creating a compelling listing helps potential tenants find and choose your home.\n\nTips for a great listing:\n- Use clear, descriptive titles (e.g., \"Peaceful Men's Home in Downtown Austin\")\n- List all amenities and house rules\n- Be specific about what's included in the monthly rate\n- Highlight what makes your home special\n\nNeed help? Check out our Listing Best Practices guide in your dashboard.\n\nReady to get started? Log in and click \"Add New Listing.\"\n\nBest,\nThe Sober Stay Team" },
        { id: 4, day: 5, subject: "Photo Tips That Get More Applications", body: "Hi [name],\n\nDid you know listings with quality photos get 5x more views? Here are our top photo tips:\n\n1. Natural lighting works best - shoot during the day with curtains open\n2. Declutter before shooting - less is more\n3. Show common areas, bedrooms, bathrooms, and outdoor spaces\n4. Include 8-12 photos minimum\n5. Capture the feeling of \"home\" - a made bed, fresh flowers, clean spaces\n\nNeed to update your photos? Edit your listing anytime from your dashboard.\n\nBest,\nThe Sober Stay Team" },
        { id: 5, day: 7, subject: "You Got an Application - Now What?", body: "Hi [name],\n\nWhen applications come in, quick responses make all the difference. Applicants often reach out to multiple homes, so responding within 24 hours gives you the best chance.\n\nBest practices for reviewing applications:\n- Read the applicant's message and background carefully\n- Check their sobriety date and references\n- Respond promptly, even if just to acknowledge receipt\n- Schedule a phone call or tour if interested\n- Be clear about next steps\n\nYou can manage all applications from your Provider Dashboard.\n\nBest,\nThe Sober Stay Team" },
        { id: 6, day: 10, subject: "Want More Visibility? Try These Tips", body: "Hi [name],\n\nLooking to increase your applications? Here are proven strategies:\n\n- Keep your listing updated with current availability\n- Respond to inquiries quickly (response time affects your ranking)\n- Add new photos seasonally\n- Update your description with any new amenities or programs\n- Consider our Featured Listing option for premium placement\n\nProviders who stay active on the platform see 40% more applications.\n\nBest,\nThe Sober Stay Team" },
        { id: 7, day: 14, subject: "How's Your Sober Stay Experience?", body: "Hi [name],\n\nYou've been with us for two weeks now! We'd love to hear how things are going.\n\n- Have you received applications?\n- Is there anything we can help with?\n- Do you have feedback on how we can improve?\n\nYour input helps us build a better platform for everyone. Reply to this email or reach out to our support team anytime.\n\nThank you for being part of the Sober Stay community.\n\nWarm regards,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "tenant-welcome",
      name: "New Tenant Welcome",
      emailCount: 5,
      active: true,
      emails: [
        { id: 1, day: 0, subject: "Welcome to Sober Stay - Your Recovery Journey Starts Here", body: "Hi [name],\n\nWelcome to Sober Stay! We're honored to be part of your recovery journey.\n\nFinding the right sober living home is an important step, and we're here to make it easier. Our platform connects you with verified, supportive housing options where you can focus on what matters most - your recovery.\n\nHere's how to get started:\n- Browse listings in your area\n- Save favorites to compare later\n- Reach out to providers with questions\n- Submit applications when you're ready\n\nTake your time. This is your journey, and we're here to support you every step of the way.\n\nWith hope,\nThe Sober Stay Team" },
        { id: 2, day: 1, subject: "How to Find Your Perfect Sober Living Home", body: "Hi [name],\n\nReady to start your search? Here's how to find the right home for you:\n\n1. Use our filters to narrow by location, price, and preferences\n2. Read descriptions carefully - look for house rules that fit your lifestyle\n3. Check amenities like transportation, meal plans, and meeting attendance\n4. Look at photos to get a feel for the environment\n5. Message providers to ask questions before applying\n\nPro tip: Save listings you like by clicking the heart icon. You can compare them later in your Favorites.\n\nHappy searching!\nThe Sober Stay Team" },
        { id: 3, day: 3, subject: "What to Look for in a Sober Living Home", body: "Hi [name],\n\nChoosing where to live during recovery is a big decision. Here's what to consider:\n\nEnvironment\n- Is it gender-specific or co-ed?\n- What's the house culture like?\n- Are residents at similar stages of recovery?\n\nStructure\n- What are the house rules?\n- Are meetings required?\n- Is there a curfew?\n\nPractical Matters\n- What's included in the rent?\n- Is transportation available?\n- Can you work or go to school?\n\nTrust your instincts. The right home should feel supportive and safe.\n\nBest,\nThe Sober Stay Team" },
        { id: 4, day: 5, subject: "Tips for a Successful Application", body: "Hi [name],\n\nReady to apply? Here's how to make a great impression:\n\n1. Be honest about your situation - providers appreciate transparency\n2. Share your recovery goals and what you're looking for in a home\n3. Include your sobriety date and any treatment history\n4. Provide reliable references (sponsor, counselor, employer)\n5. Respond promptly when providers reach out\n\nRemember, providers want to find the right fit too. Being genuine helps everyone.\n\nYou've got this!\nThe Sober Stay Team" },
        { id: 5, day: 7, subject: "Recovery Resources to Support Your Journey", body: "Hi [name],\n\nRecovery is about more than housing. Here are resources that can help:\n\nMeetings & Support\n- AA/NA Meeting Finder: aa.org/find-aa or na.org/meetingsearch\n- SMART Recovery: smartrecovery.org\n- Refuge Recovery: refugerecovery.org\n\nCrisis Support\n- SAMHSA Helpline: 1-800-662-4357 (24/7, free, confidential)\n- Crisis Text Line: Text HOME to 741741\n\nWellness\n- Daily meditation apps (Headspace, Calm, Insight Timer)\n- Exercise and nutrition resources\n- Journaling and gratitude practices\n\nYou're not alone. We're rooting for you.\n\nWith support,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "tenant-recovery",
      name: "Tenant Recovery Tips",
      emailCount: 4,
      active: true,
      emails: [
        { id: 1, day: 0, subject: "Recovery Tip: The Power of Daily Routine", body: "Hi [name],\n\nThis week's recovery tip: Build a daily routine.\n\nIn early recovery, structure is your friend. A consistent routine reduces decision fatigue and creates stability when everything else feels uncertain.\n\nSimple routine ideas:\n- Wake up at the same time each day\n- Start with something grounding (meditation, coffee, journaling)\n- Schedule meals at regular times\n- Include one recovery activity daily (meeting, call with sponsor)\n- Wind down with a consistent bedtime ritual\n\nYou don't need a perfect schedule. Just start with one small habit and build from there.\n\nOne day at a time,\nThe Sober Stay Team" },
        { id: 2, day: 7, subject: "Recovery Tip: Building Your Support Network", body: "Hi [name],\n\nThis week's recovery tip: You can't do this alone - and you don't have to.\n\nA strong support network is one of the best predictors of long-term recovery. Here's how to build yours:\n\n1. Attend meetings regularly and stay after to connect\n2. Get a sponsor or mentor who's been where you are\n3. Exchange numbers with people you relate to\n4. Be willing to reach out when you're struggling\n5. Show up for others - connection goes both ways\n\nRecovery happens in community. Let people in.\n\nWith support,\nThe Sober Stay Team" },
        { id: 3, day: 14, subject: "Recovery Tip: Self-Care Isn't Selfish", body: "Hi [name],\n\nThis week's recovery tip: Prioritize self-care.\n\nIn recovery, taking care of yourself isn't selfish - it's essential. When you're depleted, you're more vulnerable to stress and triggers.\n\nSelf-care basics:\n- Sleep: Aim for 7-9 hours. Your brain is healing.\n- Nutrition: Eat regular meals. Avoid too much sugar and caffeine.\n- Movement: Even a 20-minute walk helps regulate mood.\n- Rest: It's okay to say no and take quiet time.\n- Joy: Do something you enjoy every day, even for 10 minutes.\n\nYou deserve care and kindness - especially from yourself.\n\nBe well,\nThe Sober Stay Team" },
        { id: 4, day: 21, subject: "Recovery Tip: Setting Goals That Stick", body: "Hi [name],\n\nThis week's recovery tip: Set achievable goals.\n\nGoals give you direction and purpose. But in recovery, it's important to keep them realistic.\n\nHow to set goals that work:\n- Start small - \"I'll attend 3 meetings this week\" beats \"I'll change my whole life\"\n- Make them specific and measurable\n- Focus on what you CAN control (actions, not outcomes)\n- Celebrate progress, not just completion\n- Adjust as needed - flexibility isn't failure\n\nRecovery is the foundation. Build on it one step at a time.\n\nYou're doing great,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "application-followup",
      name: "Application Follow-up",
      emailCount: 3,
      active: true,
      emails: [
        { id: 1, day: 0, subject: "Application Received - Here's What Happens Next", body: "Hi [name],\n\nGreat news! Your application for [property] has been submitted successfully.\n\nWhat happens now:\n1. The provider will review your application (usually within 1-3 days)\n2. They may reach out with questions or to schedule a call/tour\n3. You'll receive a notification when there's an update\n\nIn the meantime:\n- Keep your phone nearby for calls\n- Check your email (and spam folder) regularly\n- Feel free to continue browsing other listings\n\nWe'll keep you posted on any updates.\n\nFingers crossed!\nThe Sober Stay Team" },
        { id: 2, day: 3, subject: "Checking In On Your Application", body: "Hi [name],\n\nJust checking in on your application for [property].\n\nThe provider is reviewing applications and should respond soon. If you haven't heard back yet, don't worry - some providers receive many applications and need a bit more time.\n\nA few tips while you wait:\n- Make sure your contact info is up to date in your profile\n- Check that you haven't missed any calls or emails\n- Consider applying to other homes as a backup\n\nWe're here if you have any questions.\n\nHang in there,\nThe Sober Stay Team" },
        { id: 3, day: 7, subject: "Still Waiting? We're Here to Help", body: "Hi [name],\n\nWe noticed your application is still pending. Sometimes providers get busy, but we want to make sure you find a home.\n\nHere are your options:\n- Send a follow-up message to the provider through our platform\n- Browse and apply to other listings that interest you\n- Contact our support team if you need help\n\nDon't give up. The right home is out there, and we're here to help you find it.\n\nWith support,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "renewal-reminders",
      name: "Renewal Reminders",
      emailCount: 3,
      active: true,
      emails: [
        { id: 1, day: -7, subject: "Your Subscription Renews in 7 Days", body: "Hi [name],\n\nJust a friendly reminder that your Sober Stay provider subscription renews in 7 days.\n\nYour current plan: Provider Listing Subscription\nRenewal date: [date]\nAmount: $49/month\n\nNo action needed if you want to continue - we'll automatically renew your subscription.\n\nNeed to make changes?\n- Update payment method: Go to Dashboard > Billing\n- Cancel subscription: Go to Dashboard > Billing > Cancel\n\nQuestions? Reply to this email or contact support.\n\nThank you for being part of Sober Stay!\n\nBest,\nThe Sober Stay Team" },
        { id: 2, day: -3, subject: "Subscription Renewal in 3 Days", body: "Hi [name],\n\nYour subscription renews in 3 days. Just making sure you're all set!\n\nQuick checklist:\n- Payment method up to date? Check in Dashboard > Billing\n- Want to switch to annual billing and save? Contact us\n- Need to cancel? You can do so anytime before renewal\n\nYour listings will remain active as long as your subscription is current.\n\nThank you for your continued partnership.\n\nBest,\nThe Sober Stay Team" },
        { id: 3, day: -1, subject: "Tomorrow: Your Subscription Renews", body: "Hi [name],\n\nQuick heads up - your subscription renews tomorrow.\n\nWe'll charge your payment method on file. If everything looks good, no action is needed.\n\nIf you need to make any changes, please do so today to avoid interruption to your listings.\n\nThank you for supporting recovery housing through Sober Stay.\n\nBest,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "inactive-reengagement",
      name: "Inactive User Re-engagement",
      emailCount: 4,
      active: false,
      emails: [
        { id: 1, day: 30, subject: "We Miss You at Sober Stay", body: "Hi [name],\n\nIt's been a little while since we've seen you on Sober Stay. We hope you're doing well.\n\nIf you're still searching for housing, we're here to help. New listings are added regularly, and we've made improvements to make your search easier.\n\nCome back and take a look: [link]\n\nIf you've already found housing, congratulations! We'd love to hear about your experience.\n\nWishing you well on your journey,\nThe Sober Stay Team" },
        { id: 2, day: 45, subject: "New Sober Living Homes in Your Area", body: "Hi [name],\n\nWe've added new sober living homes since your last visit. There might be a perfect fit waiting for you!\n\nNew listings include:\n- Various price ranges and locations\n- Different house cultures and structures\n- Updated photos and descriptions\n\nTake a fresh look: [link]\n\nYour recovery journey matters to us. We're here when you're ready.\n\nBest,\nThe Sober Stay Team" },
        { id: 3, day: 60, subject: "A Special Welcome Back", body: "Hi [name],\n\nWe want to make it easy for you to continue your housing search. As a returning member, you have full access to:\n\n- All verified listings in our network\n- Direct messaging with providers\n- Saved favorites and search history\n- Our support team, ready to help\n\nEveryone's timeline is different. Whenever you're ready, we're here.\n\nWith hope,\nThe Sober Stay Team" },
        { id: 4, day: 90, subject: "Is There Anything We Can Help With?", body: "Hi [name],\n\nWe noticed you haven't been active in a while, and we wanted to reach out.\n\nIs there anything preventing you from finding housing?\n- Having trouble with the search process?\n- Need help connecting with providers?\n- Looking for specific amenities or locations?\n- Facing other challenges we might help with?\n\nReply to this email and let us know. We're here to support you.\n\nWith care,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "success-stories",
      name: "Monthly Success Stories",
      emailCount: 1,
      active: true,
      emails: [
        { id: 1, day: 30, subject: "Inspiring Recovery Stories This Month", body: "Hi [name],\n\nEvery month, we're inspired by the journeys of people in our community. Here are some stories of hope and progress:\n\n\"Finding Sober Stay was a turning point. I'd been searching for weeks and was getting discouraged. Within a week of using the platform, I found a home that felt right. Six months later, I'm still here, working, going to meetings, and building a life I'm proud of.\" - Michael T.\n\n\"As a provider, I've seen so many people transform. Last month, one of our residents celebrated one year sober. We threw a party with cake and everything. Moments like that remind me why I do this.\" - Sarah K., Provider\n\nYour story matters too. Every day in recovery is an achievement worth celebrating.\n\nWith gratitude,\nThe Sober Stay Team\n\nP.S. Want to share your story? Reply to this email. With your permission, we might feature it to inspire others." },
      ]
    },
    {
      id: "move-in-checklist",
      name: "Move-In Preparation",
      emailCount: 4,
      active: true,
      emails: [
        { id: 1, day: -7, subject: "Your Move-In Checklist - One Week to Go!", body: "Hi [name],\n\nCongratulations! Your move-in is just one week away. Here's everything you need to prepare:\n\nDocuments to Bring:\n- Valid ID (driver's license or state ID)\n- Proof of income or financial support\n- Any paperwork requested by the provider\n\nWhat to Pack:\n- Bedding (check if provided - some homes include it)\n- Toiletries and personal care items\n- Comfortable clothing for daily life\n- Any medications (in original containers)\n- Phone charger and basic electronics\n\nWhat NOT to Bring:\n- Anything prohibited by house rules\n- Valuables you'd worry about\n- Too much stuff - start simple\n\nQuestions about move-in? Reach out to your provider directly.\n\nAlmost there!\nThe Sober Stay Team" },
        { id: 2, day: -3, subject: "3 Days Until Move-In - Final Preparations", body: "Hi [name],\n\nJust 3 days to go! Time for final preparations:\n\nConfirm the details:\n- Move-in date and time\n- Address and directions\n- Who to contact when you arrive\n- First month's rent/deposit (if not already paid)\n\nPractical prep:\n- Arrange transportation\n- Notify important contacts of your new address\n- Pack a bag with essentials for day one\n- Get a good night's sleep before the big day\n\nMental prep:\n- It's normal to feel nervous AND excited\n- Remember why you chose this step\n- Trust that you're making a positive change\n\nYou're doing something brave. We're proud of you.\n\nBest,\nThe Sober Stay Team" },
        { id: 3, day: -1, subject: "Tomorrow's the Big Day!", body: "Hi [name],\n\nThis is it - you're moving in tomorrow!\n\nQuick reminders:\n- Confirm arrival time with your provider\n- Have the address saved and directions ready\n- Bring all required documents and payment\n- Pack light for day one - you can add things later\n\nWhat to expect:\n- You'll likely get a tour and meet housemates\n- Review house rules and expectations\n- Get settled in your room\n- Take it easy - day one can be a lot\n\nMost importantly: Be kind to yourself. Starting somewhere new takes courage.\n\nWe believe in you.\n\nWith hope,\nThe Sober Stay Team" },
        { id: 4, day: 1, subject: "Welcome to Your New Home!", body: "Hi [name],\n\nYou did it! Welcome to your new home.\n\nThe first few days in a new place can feel like a lot. Here are some tips:\n\nSettling in:\n- Introduce yourself to housemates - they've all been new too\n- Learn the house routines (meals, meetings, quiet hours)\n- Find your go-to spots (a favorite chair, a quiet corner)\n- Ask questions if you're unsure about anything\n\nTaking care of yourself:\n- Stick to basics: eat, sleep, attend meetings\n- Call your sponsor or support person\n- Give yourself grace - adjustment takes time\n- Celebrate this milestone, however small it feels\n\nYou've taken a huge step. We're honored to be part of your journey.\n\nCheering you on,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "provider-tips",
      name: "Provider Best Practices",
      emailCount: 4,
      active: false,
      emails: [
        { id: 1, day: 0, subject: "5 Ways to Maximize Your Listing Visibility", body: "Hi [name],\n\nWant more applications? Here are proven strategies from our top-performing providers:\n\n1. Respond quickly to inquiries\nProviders who respond within 24 hours get 3x more confirmed move-ins. Turn on notifications so you never miss a message.\n\n2. Keep your listing updated\nUpdate availability weekly. Stale listings get pushed down in search results.\n\n3. Use quality photos\nListings with 8+ photos get 5x more views. Show bedrooms, common areas, outdoor spaces, and the neighborhood.\n\n4. Write a compelling description\nBe specific about what makes your home special. House culture, programs, location benefits - help people picture themselves there.\n\n5. Collect and display reviews\nAsk satisfied residents to leave reviews. Social proof builds trust.\n\nNeed help optimizing your listing? Reply to this email.\n\nBest,\nThe Sober Stay Team" },
        { id: 2, day: 14, subject: "Creating a Supportive Recovery Environment", body: "Hi [name],\n\nThe best sober living homes don't just provide a bed - they create an environment that supports recovery. Here's how:\n\nCommunity:\n- Foster connections between residents\n- Encourage (or require) meeting attendance together\n- Create opportunities for shared meals or activities\n\nStructure:\n- Clear, consistent house rules\n- Regular house meetings\n- Accountability without shame\n\nSupport:\n- Be approachable and available\n- Know local resources (meetings, counselors, employment)\n- Celebrate milestones together\n\nThe goal is a home where residents want to stay sober, not just have to.\n\nYou're making a difference.\n\nBest,\nThe Sober Stay Team" },
        { id: 3, day: 28, subject: "Building Positive Tenant Relationships", body: "Hi [name],\n\nStrong relationships with residents lead to better outcomes for everyone. Here are some tips:\n\nCommunication:\n- Be clear about expectations from day one\n- Address issues early, before they escalate\n- Listen more than you lecture\n\nBoundaries:\n- Be supportive but not a sponsor\n- Consistent rules for everyone\n- Separate business from personal friendship\n\nDifficult situations:\n- Approach with curiosity, not judgment\n- Focus on behavior, not character\n- Have a clear policy for violations\n\nRemember: These are people in vulnerable times. Firm compassion goes a long way.\n\nBest,\nThe Sober Stay Team" },
        { id: 4, day: 42, subject: "Staying Compliant and Organized", body: "Hi [name],\n\nGood documentation protects you and your residents. Here's a compliance checklist:\n\nEssential Documents:\n- Signed house agreements for all residents\n- Emergency contact information\n- Payment records and receipts\n- Incident reports (if any)\n- Insurance and licensing documents\n\nBest Practices:\n- Keep digital and physical copies of everything\n- Review and update house rules annually\n- Stay current on local regulations\n- Document any incidents thoroughly\n\nOrganization:\n- Use a simple filing system (by resident, then by date)\n- Set reminders for license renewals\n- Keep a move-in/move-out log\n\nNeed compliance resources? Check out our Provider Resource Center.\n\nBest,\nThe Sober Stay Team" },
      ]
    },
    {
      id: "review-request",
      name: "Review & Feedback Request",
      emailCount: 2,
      active: true,
      emails: [
        { id: 1, day: 30, subject: "How's Your Experience So Far?", body: "Hi [name],\n\nYou've been with us for a month! We'd love to hear how things are going.\n\nA few quick questions:\n- Have you found what you were looking for?\n- Is there anything we could do better?\n- Would you recommend Sober Stay to others?\n\nYour feedback helps us improve for everyone. Reply to this email or click here to share your thoughts: [link]\n\nThank you for being part of our community.\n\nWith gratitude,\nThe Sober Stay Team" },
        { id: 2, day: 60, subject: "Your Story Could Inspire Someone", body: "Hi [name],\n\nTwo months in, and we hope your recovery journey is going well.\n\nWe have a request: Would you be willing to share your experience?\n\nYour story - even a few sentences - could help someone who's scared, uncertain, or on the fence about seeking help. Hearing from real people makes a difference.\n\nIf you're open to it:\n- Reply to this email with a few words about your experience\n- We'll only share with your permission\n- You can remain anonymous if you prefer\n\nNo pressure at all. But if you're willing, your voice matters.\n\nWith appreciation,\nThe Sober Stay Team" },
      ]
    }
  ]);

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
    // Check authentication and admin role
    const user = getAuth();
    if (!isAuthenticated() || !user || user.role !== 'admin') {
      setLocation('/login');
      return;
    }
    
    setReports(getReports());
    
    // Fetch real data from database
    const fetchAdminData = async () => {
      try {
        const [usersRes, listingsRes, promosRes, featuredRes, blogPostsRes, partnersRes] = await Promise.all([
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/admin/listings', { credentials: 'include' }),
          fetch('/api/admin/promos', { credentials: 'include' }),
          fetch('/api/admin/featured-listings', { credentials: 'include' }),
          fetch('/api/admin/blog-posts', { credentials: 'include' }),
          fetch('/api/admin/partners', { credentials: 'include' })
        ]);
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const formattedUsers = usersData.map((u: any) => ({
            id: String(u.id),
            name: u.name || u.username,
            role: u.role === 'tenant' ? 'Tenant' : u.role === 'provider' ? 'Provider' : u.role,
            email: u.email,
            phone: u.phone || '',
            status: 'Active' as const,
            verified: true,
            documentsVerified: u.documentsVerified || false,
            hasFeeWaiver: u.hasFeeWaiver || false
          }));
          setUsers(formattedUsers);
          
          // Populate email subscribers from users (all registered users are potential email recipients)
          const subscribers = usersData
            .filter((u: any) => u.role !== 'admin')
            .map((u: any, index: number) => ({
              id: u.id,
              email: u.email,
              name: u.name || u.username,
              role: u.role,
              subscribeDate: new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: u.emailOptOut ? 'Unsubscribed' : 'Active'
            }));
          setEmailSubscribers(subscribers);
        }
        
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          const formattedListings = listingsData.map((l: any) => ({
            id: String(l.id),
            name: l.propertyName,
            address: l.address,
            city: l.city,
            state: l.state,
            price: l.monthlyPrice,
            pricePeriod: 'month',
            bedsAvailable: l.totalBeds,
            gender: l.gender,
            roomType: l.roomType,
            description: l.description,
            amenities: l.amenities || [],
            status: l.status === 'approved' ? 'Approved' : l.status === 'pending' ? 'Pending' : l.status === 'draft' ? 'Draft' : l.status === 'rejected' ? 'Rejected' : l.status,
            providerId: l.providerId,
            createdAt: l.createdAt,
            isVerified: l.status === 'approved',
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
          }));
          setListings(formattedListings);
        }
        
        if (promosRes.ok) {
          const promosData = await promosRes.json();
          setPromoCodes(promosData);
        }
        
        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          setAdminFeaturedListings(featuredData);
        }
        
        if (blogPostsRes.ok) {
          const blogPostsData = await blogPostsRes.json();
          setDatabaseBlogPosts(blogPostsData);
        }
        
        if (partnersRes.ok) {
          const partnersData = await partnersRes.json();
          setPartners(partnersData);
        }
        
        // Sample applications data
        setApplications([
          { id: "app-1", applicantName: "John Doe", tenantName: "John Doe", email: "john.doe@gmail.com", phone: "(555) 123-4567", propertyName: "Recovery First Residence", status: "Pending", submittedDate: "2024-12-05", completeness: 85, message: "I'm seeking a supportive environment for my recovery journey.", sobrietyDate: "2024-06-15", emergencyContact: "Jane Doe - (555) 987-6543" },
          { id: "app-2", applicantName: "Sarah Miller", tenantName: "Sarah Miller", email: "sarah.miller@yahoo.com", phone: "(555) 234-5678", propertyName: "Hope House Women's Home", status: "Pending", submittedDate: "2024-12-04", completeness: 100, message: "Looking for a women-only home with a peaceful atmosphere.", sobrietyDate: "2024-03-20", emergencyContact: "Tom Miller - (555) 876-5432" },
          { id: "app-3", applicantName: "Mike Johnson", tenantName: "Mike Johnson", email: "mike.johnson@outlook.com", phone: "(555) 345-6789", propertyName: "Serenity Living Co-Ed", status: "Approved", submittedDate: "2024-12-03", completeness: 100, message: "I need a place that supports my recovery goals.", sobrietyDate: "2024-01-10", emergencyContact: "Lisa Johnson - (555) 765-4321" },
          { id: "app-4", applicantName: "Emily Wilson", tenantName: "Emily Wilson", email: "emily.wilson@gmail.com", phone: "(555) 456-7890", propertyName: "New Beginnings Faith Home", status: "Needs Info", submittedDate: "2024-12-02", completeness: 60, message: "Interested in faith-based recovery support.", sobrietyDate: "2024-09-01", emergencyContact: "David Wilson - (555) 654-3210" },
        ]);
        
        // Sample messages data  
        setMessages([
          { id: "msg-1", tenant: "John Doe", provider: "Recovery First LLC", preview: "Hi, I'm interested in your facility. Can I schedule a tour?", date: "Dec 5, 2024", flagged: false },
          { id: "msg-2", tenant: "Sarah Miller", provider: "Hope House", preview: "What are your house rules regarding visitors?", date: "Dec 4, 2024", flagged: false },
          { id: "msg-3", tenant: "Anonymous User", provider: "Serenity Living", preview: "This message contains inappropriate content...", date: "Dec 3, 2024", flagged: true, reason: "Inappropriate Content" },
        ]);
        
      setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
    
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
  }, [setLocation]);

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

  const handleToggleProviderVerification = async (userId: string, currentlyVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/providers/${userId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ verified: !currentlyVerified })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, documentsVerified: !currentlyVerified } : u));
        toast({ 
          title: !currentlyVerified ? "Provider Verified" : "Verification Removed", 
          description: !currentlyVerified 
            ? "Provider can now purchase featured listings." 
            : "Provider's verification has been revoked." 
        });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to update verification", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update verification", variant: "destructive" });
    }
  };

  const handleToggleFeeWaiver = async (userId: string, currentlyHasWaiver: boolean) => {
    try {
      const res = await fetch(`/api/admin/providers/${userId}/fee-waiver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ hasFeeWaiver: !currentlyHasWaiver })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, hasFeeWaiver: !currentlyHasWaiver } : u));
        toast({ 
          title: !currentlyHasWaiver ? "Fee Waiver Granted" : "Fee Waiver Revoked", 
          description: !currentlyHasWaiver 
            ? "Provider can now create listings without payment." 
            : "Provider will now need to pay for listings." 
        });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to update fee waiver", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update verification", variant: "destructive" });
    }
  };

  const handleUnsubscribe = async (subscriberId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${subscriberId}/email-subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emailOptOut: true })
      });
      
      if (res.ok) {
        setEmailSubscribers(emailSubscribers.map(s => 
          s.id === subscriberId ? { ...s, status: 'Unsubscribed' } : s
        ));
        toast({ 
          title: "User Unsubscribed", 
          description: "This user will no longer receive marketing emails." 
        });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to unsubscribe user", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to unsubscribe user", variant: "destructive" });
    }
  };

  const handleSendBulkEmail = async () => {
    if (!composeEmailSubject || !composeEmailBody) {
      toast({ title: "Error", description: "Please enter both subject and message", variant: "destructive" });
      return;
    }
    
    setSendingBulkEmail(true);
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: composeEmailSubject,
          body: composeEmailBody,
          audience: 'all'
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        toast({ 
          title: "Emails Sent", 
          description: data.message || `Successfully sent ${data.sent} emails`
        });
        setShowComposeEmailModal(false);
        setComposeEmailSubject("");
        setComposeEmailBody("");
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to send emails", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send emails", variant: "destructive" });
    } finally {
      setSendingBulkEmail(false);
    }
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

  const handleQuickApproveListing = async (listingId: string) => {
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        setListings(listings.map(l => l.id === listingId ? { ...l, status: "Approved", denialReason: null } : l));
        toast({ title: "Listing Approved", description: "The listing is now visible to users." });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to approve listing", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve listing", variant: "destructive" });
    }
  };

  const handleUnrejectListing = async (listingId: string) => {
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'pending' })
      });
      if (res.ok) {
        setListings(listings.map(l => l.id === listingId ? { ...l, status: "Pending", denialReason: null } : l));
        toast({ title: "Listing Reset", description: "The listing has been reset to pending review." });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to reset listing", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reset listing", variant: "destructive" });
    }
  };

  const handleToggleListingVisibility = async (listingId: string, currentlyHidden: boolean) => {
    try {
      const res = await fetch(`/api/admin/listings/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isVisible: currentlyHidden })
      });
      if (res.ok) {
        setListings(listings.map(l => l.id === listingId ? { ...l, isHidden: !currentlyHidden } : l));
        toast({ 
          title: currentlyHidden ? "Listing Visible" : "Listing Hidden", 
          description: currentlyHidden ? "The listing is now visible to users." : "The listing is now hidden from users." 
        });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to update visibility", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" });
    }
  };

  const [rejectingListing, setRejectingListing] = useState<any>(null);
  const [showRejectListingModal, setShowRejectListingModal] = useState(false);
  const [rejectListingReason, setRejectListingReason] = useState("");

  const openRejectListingModal = (listing: any) => {
    setRejectingListing(listing);
    setRejectListingReason("");
    setShowRejectListingModal(true);
  };

  const handleConfirmRejectListing = async () => {
    if (!rejectingListing || !rejectListingReason.trim()) return;
    
    try {
      const res = await fetch(`/api/admin/listings/${rejectingListing.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'rejected' })
      });
      if (res.ok) {
        setListings(listings.map(l => l.id === rejectingListing.id ? { ...l, status: "Rejected", denialReason: rejectListingReason } : l));
        toast({ title: "Listing Rejected", description: "The listing has been rejected." });
        setShowRejectListingModal(false);
        setRejectingListing(null);
        setRejectListingReason("");
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to reject listing", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject listing", variant: "destructive" });
    }
  };

  const [deletingListing, setDeletingListing] = useState<any>(null);
  const [showDeleteListingModal, setShowDeleteListingModal] = useState(false);

  const openDeleteListingModal = (listing: any) => {
    setDeletingListing(listing);
    setShowDeleteListingModal(true);
  };

  const handleConfirmDeleteListing = async () => {
    if (!deletingListing) return;
    
    try {
      const res = await fetch(`/api/admin/listings/${deletingListing.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setListings(listings.filter(l => l.id !== deletingListing.id));
        toast({ title: "Listing Deleted", description: "The listing has been permanently removed." });
        setShowDeleteListingModal(false);
        setDeletingListing(null);
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to delete listing", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete listing", variant: "destructive" });
    }
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

  const [viewingThread, setViewingThread] = useState<any>(null);
  const [showThreadModal, setShowThreadModal] = useState(false);

  const handleViewThread = (msg: any) => {
    setViewingThread({
      ...msg,
      messages: [
        { id: 1, sender: msg.tenant, content: msg.preview, timestamp: new Date().toISOString(), isProvider: false },
        { id: 2, sender: msg.provider, content: "Thank you for reaching out! I'd be happy to schedule a tour. What day works best for you?", timestamp: new Date().toISOString(), isProvider: true },
        { id: 3, sender: msg.tenant, content: "How about this Saturday around 2pm?", timestamp: new Date().toISOString(), isProvider: false },
        { id: 4, sender: msg.provider, content: "Saturday at 2pm works perfectly. I'll see you then!", timestamp: new Date().toISOString(), isProvider: true },
      ]
    });
    setShowThreadModal(true);
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

  const handleResetDocumentStatus = (docId: string) => {
    setDocuments(documents.map(d => d.id === docId ? { ...d, status: "Pending Review", denialReason: null, infoRequest: null, reviewedAt: null } : d));
    toast({ title: "Document Reset", description: "Document status has been reset to pending review." });
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

  const handleSendPaymentReminder = async (provider: string, email: string) => {
    try {
      const res = await fetch('/api/admin/send-payment-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ providerName: provider, email })
      });
      
      if (res.ok) {
        toast({
          title: "Reminder Sent",
          description: `Payment reminder email sent to ${provider} at ${email}`,
        });
      } else {
        const err = await res.json();
        toast({
          title: "Error",
          description: err.error || "Failed to send payment reminder",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send payment reminder email",
        variant: "destructive"
      });
    }
  };

  const handleContactProvider = async (provider: string, email: string) => {
    try {
      const res = await fetch('/api/admin/contact-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ providerName: provider, email })
      });
      
      if (res.ok) {
        toast({
          title: "Contact Email Sent",
          description: `Contact email sent to ${provider} at ${email}`,
        });
      } else {
        const err = await res.json();
        toast({
          title: "Error",
          description: err.error || "Failed to send contact email",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact email",
        variant: "destructive"
      });
    }
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

  const handleSendCampaign = async () => {
    if (!emailSubject.trim() || !emailBodyText.trim()) {
      toast({ 
        title: "Missing Information", 
        description: "Please enter both a subject and content for your email.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: emailSubject,
          body: emailBodyText,
          audience: emailRecipientGroup
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast({ 
          title: "Campaign Sent!", 
          description: result.message || `Successfully sent ${result.sent} emails.`
        });
        setShowEmailComposer(false);
        setEmailSubject("");
        setEmailBodyText("");
      } else {
        toast({ 
          title: "Send Failed", 
          description: result.error || "Failed to send email campaign. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Email send error:', error);
      toast({ 
        title: "Error", 
        description: "An error occurred while sending the campaign.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
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

  const handleUpdateTemplateTrigger = (templateId: number, newTrigger: string) => {
    const template = marketingTemplates.find(t => t.id === templateId);
    setMarketingTemplates(marketingTemplates.map(t =>
      t.id === templateId ? { ...t, trigger: newTrigger } : t
    ));
    
    if (template) {
      const triggerLabels: { [key: string]: string } = {
        "none": "Manual Only",
        "on-provider-signup": "On Provider Signup",
        "on-tenant-signup": "On Tenant Signup",
        "on-application-approved": "On Application Approved",
        "on-application-submitted": "On Application Submitted",
        "on-tour-scheduled": "On Tour Scheduled",
        "on-tour-completed": "On Tour Completed",
        "on-listing-approved": "On Listing Approved",
        "7-days-before-renewal": "7 Days Before Renewal",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "daily": "Daily",
      };
      
      if (newTrigger === "none") {
        toast({
          title: "Trigger Deactivated",
          description: `"${template.name}" will now only send manually`,
        });
      } else {
        toast({
          title: "Trigger Activated",
          description: `"${template.name}" will now send ${triggerLabels[newTrigger] || newTrigger}`,
        });
      }
    }
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: { [key: string]: string } = {
      "none": "Manual Only",
      "on-provider-signup": "Provider Signup",
      "on-tenant-signup": "Tenant Signup",
      "on-application-approved": "App Approved",
      "on-application-submitted": "App Submitted",
      "on-tour-scheduled": "Tour Scheduled",
      "on-tour-completed": "Tour Completed",
      "on-listing-approved": "Listing Approved",
      "7-days-before-renewal": "Before Renewal",
      "weekly": "Weekly",
      "monthly": "Monthly",
      "daily": "Daily",
    };
    return labels[trigger] || trigger;
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
    setEditingBlogPostId(null);
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

  const handlePublishBlog = async () => {
    if (blogTitle.trim() && blogContent.trim()) {
      try {
        const postData = {
          title: blogTitle,
          slug: blogSlug || generateSlug(blogTitle),
          excerpt: blogExcerpt || blogContent.substring(0, 150) + "...",
          content: blogContent,
          author: blogAuthor || "Admin",
          category: blogCategory,
          tags: blogTags.split(",").map(t => t.trim()).filter(t => t),
          status: "published",
          scheduledAt: blogScheduleDate || null
        };
        
        let res;
        if (editingBlogPostId) {
          // Update existing post
          res = await fetch(`/api/admin/blog-posts/${editingBlogPostId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
          });
        } else {
          // Create new post
          res = await fetch('/api/admin/blog-posts', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
          });
        }
        
        if (res.ok) {
          const savedPost = await res.json();
          if (editingBlogPostId) {
            setDatabaseBlogPosts(prev => prev.map(p => p.id === editingBlogPostId ? savedPost : p));
          } else {
            setDatabaseBlogPosts(prev => [savedPost, ...prev]);
          }
          setBlogPublishSuccess(true);
          setTimeout(() => setBlogPublishSuccess(false), 3000);
          setEditingBlogPostId(null);
        } else {
          const error = await res.json();
          toast({ title: "Error", description: error.error || "Failed to save blog post", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error saving blog post:", error);
        toast({ title: "Error", description: "Failed to save blog post", variant: "destructive" });
      }
    }
    setShowBlogModal(false);
    setShowBlogEditor(false);
  };

  const handleEditBlogPost = (post: any) => {
    setBlogTitle(post.title);
    setBlogContent(post.content);
    setBlogExcerpt(post.excerpt || "");
    setBlogCategory(post.category);
    setBlogAuthor(post.author);
    setBlogTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setBlogSlug(post.slug);
    setBlogScheduleDate(post.scheduledAt ? new Date(post.scheduledAt).toISOString().split('T')[0] : "");
    setEditingBlogPostId(post.id);
    setShowBlogModal(true);
  };

  const handleDeleteBlogPost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      const res = await fetch(`/api/admin/blog-posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        setDatabaseBlogPosts(prev => prev.filter(p => p.id !== postId));
        toast({ title: "Success", description: "Blog post deleted" });
      } else {
        toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" });
    }
  };

  const handleCreatePromo = async () => {
    if (!newPromoCode.trim() || !newPromoDiscountValue) {
      toast({ title: "Missing fields", description: "Please fill in code and discount value", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: newPromoCode.toUpperCase(),
          discountType: newPromoDiscountType,
          discountValue: parseInt(newPromoDiscountValue),
          target: newPromoTarget,
          usageLimit: newPromoLimit ? parseInt(newPromoLimit) : 0,
          isActive: newPromoActive,
          expiresAt: newPromoExpiry || null
        })
      });
      if (res.ok) {
        const promo = await res.json();
        setPromoCodes([promo, ...promoCodes]);
        setNewPromoCode("");
        setNewPromoDiscountValue("");
        setNewPromoLimit("");
        setNewPromoExpiry("");
        toast({ title: "Promo created", description: `Code ${promo.code} created successfully` });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to create promo", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create promo code", variant: "destructive" });
    }
  };

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo);
    setNewPromoCode(promo.code);
    setNewPromoDiscountType(promo.discountType);
    setNewPromoDiscountValue(String(promo.discountValue));
    setNewPromoTarget(promo.target);
    setNewPromoLimit(promo.usageLimit ? String(promo.usageLimit) : "");
    setNewPromoActive(promo.isActive);
    setNewPromoExpiry(promo.expiresAt ? new Date(promo.expiresAt).toISOString().split('T')[0] : "");
    setShowPromoModal(true);
  };

  const handleSavePromo = async () => {
    if (!editingPromo) return;
    try {
      const res = await fetch(`/api/admin/promos/${editingPromo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: newPromoCode.toUpperCase(),
          discountType: newPromoDiscountType,
          discountValue: parseInt(newPromoDiscountValue),
          target: newPromoTarget,
          usageLimit: newPromoLimit ? parseInt(newPromoLimit) : 0,
          isActive: newPromoActive,
          expiresAt: newPromoExpiry || null
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setPromoCodes(promoCodes.map(p => p.id === updated.id ? updated : p));
        setShowPromoModal(false);
        setEditingPromo(null);
        toast({ title: "Promo updated", description: `Code ${updated.code} updated successfully` });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error || "Failed to update promo", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update promo code", variant: "destructive" });
    }
  };

  const handleDeletePromo = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/promos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setPromoCodes(promoCodes.filter(p => p.id !== id));
        toast({ title: "Promo deleted", description: "Promo code deleted successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete promo code", variant: "destructive" });
    }
  };

  const handleTogglePromoActive = async (promo: any) => {
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !promo.isActive })
      });
      if (res.ok) {
        const updated = await res.json();
        setPromoCodes(promoCodes.map(p => p.id === updated.id ? updated : p));
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to toggle promo status", variant: "destructive" });
    }
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
          <TabsList className="bg-gradient-to-r from-card via-card to-card border border-border/50 p-2 flex flex-wrap gap-2 h-auto justify-start rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all">Dashboard</TabsTrigger>
            <TabsTrigger value="users" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><Users className="w-3.5 h-3.5" /> Users {newUsers > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="listings" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><Building className="w-3.5 h-3.5" /> Listings {newListings > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="applications" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all relative">Applications {newApplications > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="messaging" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><MessageSquare className="w-3.5 h-3.5" /> Messages {messages.filter(m => m.flagged).length > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="verification" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><Shield className="w-3.5 h-3.5" /> Verification {newVerifications > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="reports" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Reports</TabsTrigger>
            <TabsTrigger value="compliance" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><ShieldAlert className="w-3.5 h-3.5" /> Safety {complianceIssues.filter(i => i.status === "Urgent").length > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="billing" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><DollarSign className="w-3.5 h-3.5" /> Billing {newBillingSubscriptions > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="analytics" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Analytics</TabsTrigger>
            <TabsTrigger value="support" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5 relative"><Mail className="w-3.5 h-3.5" /> Support {newTicketsCount > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}</TabsTrigger>
            <TabsTrigger value="marketing" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Marketing</TabsTrigger>
            <TabsTrigger value="workflows" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><Activity className="w-3.5 h-3.5" /> Workflows</TabsTrigger>
            <TabsTrigger value="email-list" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><Mail className="w-3.5 h-3.5" /> Email List</TabsTrigger>
            <TabsTrigger value="settings" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><Settings className="w-3.5 h-3.5" /> Settings</TabsTrigger>
            <TabsTrigger value="partners" className="px-3 py-2 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary hover:bg-white/5 rounded-md transition-all gap-1.5"><Users className="w-3.5 h-3.5" /> Partners</TabsTrigger>
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
                        {user.role === "Provider" && (
                          <>
                            <Badge 
                              className={user.documentsVerified 
                                ? "bg-blue-500/80 text-white" 
                                : "bg-gray-500/50 text-gray-300"
                              }
                            >
                              {user.documentsVerified ? "Docs Verified" : "Unverified"}
                            </Badge>
                            {user.hasFeeWaiver && (
                              <Badge className="bg-purple-500/80 text-white">
                                Fee Waiver
                              </Badge>
                            )}
                          </>
                        )}
                        <Badge variant={user.status === "Active" ? "default" : "outline"} className={user.status === "Active" ? "bg-green-500/80" : user.status === "Suspended" ? "bg-red-500/80" : "bg-amber-500/80"}>{user.status}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 text-primary hover:bg-primary/10" onClick={() => handleEditUser(user)}>Edit</Button>
                          {user.role === "Provider" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className={`h-8 ${user.documentsVerified ? "text-amber-500 hover:bg-amber-500/10" : "text-blue-500 hover:bg-blue-500/10"}`}
                                onClick={() => handleToggleProviderVerification(user.id, user.documentsVerified || false)}
                                data-testid={`button-verify-provider-${user.id}`}
                              >
                                {user.documentsVerified ? "Revoke Verify" : "Verify Docs"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className={`h-8 ${user.hasFeeWaiver ? "text-green-500 hover:bg-green-500/10" : "text-purple-500 hover:bg-purple-500/10"}`}
                                onClick={() => handleToggleFeeWaiver(user.id, user.hasFeeWaiver || false)}
                                data-testid={`button-fee-waiver-${user.id}`}
                              >
                                {user.hasFeeWaiver ? "Revoke Waiver" : "Fee Waiver"}
                              </Button>
                            </>
                          )}
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
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5" /> Listing Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">Review, approve, reject, and manage all property listings</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {listings.filter(l => l.status === "Pending").length} Pending
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    {listings.filter(l => l.status === "Approved").length} Approved
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 text-xs">
                    {listings.filter(l => l.status === "Rejected").length} Rejected
                  </Badge>
                  <Badge className="bg-slate-500/20 text-slate-400 text-xs">
                    {listings.filter(l => l.status === "Draft").length} Draft
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div key={listing.id} className={`p-4 rounded-lg border transition-all ${
                      listing.status === "Pending" ? "bg-amber-500/5 border-amber-500/20" :
                      listing.status === "Approved" ? "bg-green-500/5 border-green-500/20" :
                      listing.status === "Rejected" ? "bg-red-500/5 border-red-500/20" :
                      listing.status === "Draft" ? "bg-slate-500/5 border-slate-500/20" :
                      "bg-white/5 border-border/50"
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex gap-3 flex-1">
                          <img src={listing.image} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="text-white font-bold">{listing.name}</p>
                            <p className="text-sm text-muted-foreground">{listing.address}, {listing.city}, {listing.state}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary">${listing.price}/{listing.pricePeriod}</Badge>
                              <Badge variant="secondary" className="text-xs">{listing.bedsAvailable} beds</Badge>
                              {listing.isVerified && <Badge className="bg-blue-500/80 text-xs">Verified</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={
                            listing.status === "Approved" ? "bg-green-500/80" :
                            listing.status === "Rejected" ? "bg-red-500/80" :
                            listing.status === "Draft" ? "bg-gray-500/80" :
                            "bg-amber-500/80"
                          }>{listing.status}</Badge>
                          {flaggedListings.has(listing.id) && <Badge className="bg-red-500/80 text-xs">⚠ Flagged</Badge>}
                          {listing.isHidden && <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-400">Hidden</Badge>}
                        </div>
                      </div>
                      
                      {listing.denialReason && (
                        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm">
                          <span className="text-red-400 font-medium">Rejection Reason:</span> <span className="text-red-300">{listing.denialReason}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleReviewListing(listing)} className="h-8 gap-1 text-xs" data-testid={`button-view-listing-${listing.id}`}>
                          <Eye className="w-3 h-3" /> View Details
                        </Button>
                        
                        {listing.status === "Pending" && (
                          <>
                            <Button size="sm" onClick={() => handleQuickApproveListing(listing.id)} className="h-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 gap-1 text-xs" data-testid={`button-approve-listing-${listing.id}`}>
                              <Check className="w-3 h-3" /> Approve
                            </Button>
                            <Button size="sm" onClick={() => openRejectListingModal(listing)} variant="outline" className="h-8 border-red-500/30 text-red-500 hover:bg-red-500/10 gap-1 text-xs" data-testid={`button-reject-listing-${listing.id}`}>
                              <X className="w-3 h-3" /> Reject
                            </Button>
                          </>
                        )}
                        
                        {listing.status === "Rejected" && (
                          <>
                            <Button size="sm" onClick={() => handleUnrejectListing(listing.id)} className="h-8 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 gap-1 text-xs" data-testid={`button-unreject-listing-${listing.id}`}>
                              <RotateCcw className="w-3 h-3" /> Reset to Pending
                            </Button>
                            <Button size="sm" onClick={() => handleQuickApproveListing(listing.id)} className="h-8 bg-green-500/20 text-green-500 hover:bg-green-500/30 gap-1 text-xs" data-testid={`button-approve-rejected-${listing.id}`}>
                              <Check className="w-3 h-3" /> Approve
                            </Button>
                          </>
                        )}
                        
                        {listing.status === "Approved" && (
                          <Button size="sm" onClick={() => handleToggleListingVisibility(listing.id, listing.isHidden)} variant="outline" className={`h-8 gap-1 text-xs ${listing.isHidden ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-gray-500/30 text-gray-400 hover:bg-gray-500/10"}`} data-testid={`button-toggle-visibility-${listing.id}`}>
                            {listing.isHidden ? <><Eye className="w-3 h-3" /> Show</> : <><EyeOff className="w-3 h-3" /> Hide</>}
                          </Button>
                        )}
                        
                        <Button size="sm" onClick={() => handleFlagListing(listing.id)} variant="ghost" className={`h-8 text-xs ${flaggedListings.has(listing.id) ? "text-red-400" : "text-amber-500"} hover:bg-amber-500/10 gap-1`} data-testid={`button-flag-listing-${listing.id}`}>
                          <AlertTriangle className="w-3 h-3" /> {flaggedListings.has(listing.id) ? "Unflag" : "Flag"}
                        </Button>
                        
                        <Button size="sm" onClick={() => openDeleteListingModal(listing)} variant="ghost" className="h-8 text-xs text-red-500 hover:bg-red-500/10 gap-1" data-testid={`button-delete-listing-${listing.id}`}>
                          <Trash2 className="w-3 h-3" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {listings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No listings to manage</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                          {(doc.status === "Approved" || doc.status === "Rejected") && (
                            <Button size="sm" onClick={() => handleResetDocumentStatus(doc.id)} className="h-8 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 gap-1 text-xs" data-testid={`button-reset-document-${doc.id}`}>
                              <RotateCcw className="w-3 h-3" /> Reset to Pending
                            </Button>
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
                          <Button size="sm" variant="outline" onClick={() => handleViewThread(msg)} className="h-7 text-xs" data-testid={`button-view-thread-${msg.id}`}>View Thread</Button>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Email Subscribers</h2>
              <Button 
                onClick={() => setShowComposeEmailModal(true)}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-compose-email"
              >
                <Mail className="w-4 h-4 mr-2" /> Send Email to All
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">{emailSubscribers.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">{emailSubscribers.filter(s => s.status === "Active").length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border">
                <Users className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">{emailSubscribers.filter(s => s.role === "tenant").length}</p>
                  <p className="text-xs text-muted-foreground">Tenants</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border">
                <Building className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">{emailSubscribers.filter(s => s.role === "provider").length}</p>
                  <p className="text-xs text-muted-foreground">Providers</p>
                </div>
              </div>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Subscriber List</CardTitle>
              </CardHeader>
              <CardContent>
                {emailSubscribers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No subscribers yet. Users who sign up will appear here.</p>
                ) : (
                  <div className="space-y-2">
                    {emailSubscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-white/5 transition-colors border border-border/50">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-white font-medium">{subscriber.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {subscriber.name} • {subscriber.role === 'tenant' ? 'Tenant' : 'Provider'} • Joined {subscriber.subscribeDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={subscriber.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-400"}>
                            {subscriber.status}
                          </Badge>
                          {subscriber.status === "Active" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleUnsubscribe(subscriber.id)}
                              data-testid={`button-unsubscribe-${subscriber.id}`}
                            >
                              Unsubscribe
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Subscription Waivers
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{waivedProviders.length} Active Waivers</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">Grant providers exemption from the $49/month subscription fee for partnerships, promotions, or community benefits.</p>
                
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-white font-semibold mb-3">Waive Listing Fee by Email</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Provider Email</label>
                      <input 
                        type="email" 
                        value={waiverSearchEmail}
                        onChange={(e) => setWaiverSearchEmail(e.target.value)}
                        placeholder="provider@example.com" 
                        className="w-full px-3 py-2 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Reason</label>
                      <select 
                        value={waiverReason}
                        onChange={(e) => setWaiverReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                      >
                        <option value="">Select reason...</option>
                        <option value="Partnership Agreement">Partnership Agreement</option>
                        <option value="Promotional Offer">Promotional Offer</option>
                        <option value="Community Partner">Community Partner</option>
                        <option value="Non-Profit Organization">Non-Profit Organization</option>
                        <option value="Beta Tester">Beta Tester</option>
                        <option value="Referral Reward">Referral Reward</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                      <select 
                        value={waiverDuration}
                        onChange={(e) => setWaiverDuration(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                      >
                        <option value="1-month">1 Month</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="1-year">1 Year</option>
                        <option value="permanent">Permanent</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={() => {
                          if (waiverSearchEmail && waiverReason) {
                            const providerName = waiverSearchEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            setWaivedProviders([...waivedProviders, {
                              id: waivedProviders.length + 1,
                              provider: providerName,
                              email: waiverSearchEmail,
                              status: "Active Waiver",
                              reason: waiverReason,
                              duration: waiverDuration === 'permanent' ? 'Permanent' : waiverDuration.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                              grantedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            }]);
                            setWaiverSearchEmail("");
                            setWaiverReason("");
                            toast({ title: "Waiver Granted", description: `Listing fee waived for ${waiverSearchEmail}` });
                          }
                        }}
                        disabled={!waiverSearchEmail || !waiverReason}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Grant Waiver
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-white font-semibold text-sm mb-3">Active Waivers</h3>
                  {waivedProviders.length === 0 ? (
                    <div className="text-center py-8 rounded-lg bg-white/5 border border-white/10 border-dashed">
                      <DollarSign className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No active waivers</p>
                    </div>
                  ) : (
                    waivedProviders.map((item) => (
                      <div key={item.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.provider}</p>
                          <p className="text-xs text-primary">{item.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.reason} • {item.duration} • Granted {item.grantedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/80">{item.status}</Badge>
                          <Button 
                            onClick={() => {
                              setWaivedProviders(waivedProviders.filter(p => p.id !== item.id));
                              toast({ title: "Waiver Revoked", description: `Waiver removed for ${item.email}` });
                            }} 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs text-red-500 hover:text-red-400"
                          >
                            Revoke
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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

          {/* PARTNERS MANAGEMENT */}
          <TabsContent value="partners" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" /> Partners Management
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      setEditingPartner(null);
                      setPartnerName("");
                      setPartnerCategory("organization");
                      setPartnerDescription("");
                      setPartnerWebsite("");
                      setPartnerFocus([]);
                      setPartnerIsActive(true);
                      setShowPartnerModal(true);
                    }} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    data-testid="button-add-partner"
                  >
                    <Plus className="w-4 h-4" /> Add Partner
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Manage recovery partners, treatment centers, and resource organizations.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {partners.length === 0 ? (
                  <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10 border-dashed">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No partners yet</p>
                    <p className="text-muted-foreground text-sm">Add treatment centers, organizations, and other recovery resources.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {partners.map((partner) => (
                      <div key={partner.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between" data-testid={`partner-row-${partner.id}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{partner.name}</p>
                            <Badge className={partner.isActive ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-400"}>
                              {partner.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">{partner.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{partner.description}</p>
                          {partner.website && (
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{partner.website}</a>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingPartner(partner);
                              setPartnerName(partner.name);
                              setPartnerCategory(partner.category);
                              setPartnerDescription(partner.description || "");
                              setPartnerWebsite(partner.website || "");
                              setPartnerFocus(partner.focus || []);
                              setPartnerIsActive(partner.isActive);
                              setShowPartnerModal(true);
                            }}
                            data-testid={`button-edit-partner-${partner.id}`}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-400"
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this partner?")) {
                                try {
                                  const res = await fetch(`/api/admin/partners/${partner.id}`, {
                                    method: 'DELETE',
                                    credentials: 'include'
                                  });
                                  if (res.ok) {
                                    setPartners(partners.filter(p => p.id !== partner.id));
                                    toast({ title: "Partner Deleted", description: `${partner.name} has been removed.` });
                                  }
                                } catch (error) {
                                  toast({ title: "Error", description: "Failed to delete partner", variant: "destructive" });
                                }
                              }
                            }}
                            data-testid={`button-delete-partner-${partner.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Email Campaigns
                  </CardTitle>
                  <Button onClick={() => { setEmailSubject(""); setEmailBodyText(""); setShowEmailComposer(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Plus className="w-4 h-4" /> Compose Email
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">One-time emails sent to specific user groups.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12 rounded-lg bg-white/5 border border-white/10 border-dashed">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No campaigns yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Create your first email campaign to engage users</p>
                    <Button onClick={() => { setEmailSubject(""); setEmailBodyText(""); setShowEmailComposer(true); }} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Compose Email</Button>
                  </div>
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
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-400" /> Featured Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-300">Manage provider listing boosts and featured placement purchases.</p>
                
                {adminFeaturedListings.length === 0 ? (
                  <div className="text-center py-8 rounded-lg bg-white/5 border border-white/10 border-dashed">
                    <Building className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">No featured listings yet</p>
                    <p className="text-xs text-muted-foreground">Providers can purchase boosts from their dashboard</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {adminFeaturedListings.map((featured) => {
                      const daysLeft = Math.ceil((new Date(featured.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      const isExpired = daysLeft <= 0;
                      return (
                        <div key={featured.id} className={`p-4 rounded-lg border flex items-center justify-between ${isExpired ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-purple-500/20'}`}>
                          <div>
                            <p className="text-white font-medium">{featured.listingName || `Listing #${featured.listingId}`}</p>
                            <p className="text-xs text-muted-foreground">Provider: {featured.providerName || `ID ${featured.providerId}`}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-purple-500/80 text-xs">{featured.boostLevel}x Boost</Badge>
                              {isExpired ? (
                                <Badge className="bg-red-500/80 text-xs">Expired</Badge>
                              ) : (
                                <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">{daysLeft} days left</Badge>
                              )}
                              {featured.isActive && !isExpired && (
                                <Badge className="bg-green-500/80 text-xs">Active</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">${featured.totalPrice}</p>
                            <p className="text-xs text-muted-foreground">{featured.durationDays} days</p>
                            <Button 
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/admin/featured-listings/${featured.id}/toggle`, {
                                    method: 'PATCH',
                                    credentials: 'include'
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setAdminFeaturedListings(prev => prev.map(f => f.id === featured.id ? updated : f));
                                    toast({ title: "Updated", description: `Featured listing ${updated.isActive ? 'activated' : 'deactivated'}` });
                                  }
                                } catch (err) {
                                  toast({ title: "Error", description: "Failed to update", variant: "destructive" });
                                }
                              }}
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              data-testid={`button-toggle-featured-${featured.id}`}
                            >
                              {featured.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Summary Stats */}
                {adminFeaturedListings.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-purple-500/20">
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-400">{adminFeaturedListings.filter(f => f.isActive && new Date(f.endDate) > new Date()).length}</p>
                      <p className="text-xs text-muted-foreground">Active Boosts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">${adminFeaturedListings.reduce((sum, f) => sum + (f.totalPrice || 0), 0)}</p>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-emerald-400">{adminFeaturedListings.length}</p>
                      <p className="text-xs text-muted-foreground">All Time Boosts</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Email Templates
                  </CardTitle>
                  <Button 
                    onClick={() => {
                      setNewTemplateName("");
                      setNewTemplateType("Email");
                      setNewTemplateTrigger("none");
                      setNewTemplateAudience("all");
                      setNewTemplateSubject("");
                      setNewTemplateBody("");
                      setShowNewTemplateModal(true);
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    data-testid="button-add-template"
                  >
                    <Plus className="w-4 h-4" /> Add Template
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Create reusable email templates. Set triggers to send them automatically.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {marketingTemplates.map((template) => (
                    <div key={template.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{template.type} • Used {template.uses} times</p>
                        </div>
                        {template.trigger !== "none" && (
                          <Badge variant="outline" className="text-xs bg-primary/20 text-primary border-primary/30">
                            {getTriggerLabel(template.trigger)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <label className="text-xs text-muted-foreground mb-1 block">Auto-send Trigger</label>
                        <select 
                          value={template.trigger}
                          onChange={(e) => handleUpdateTemplateTrigger(template.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-xs"
                          data-testid={`select-trigger-${template.id}`}
                        >
                          <option value="none">Manual Only (No Trigger)</option>
                          <optgroup label="Signup Events">
                            <option value="on-provider-signup">On Provider Signup</option>
                            <option value="on-tenant-signup">On Tenant Signup</option>
                          </optgroup>
                          <optgroup label="Application Events">
                            <option value="on-application-submitted">On Application Submitted</option>
                            <option value="on-application-approved">On Application Approved</option>
                          </optgroup>
                          <optgroup label="Tour Events">
                            <option value="on-tour-scheduled">On Tour Scheduled</option>
                            <option value="on-tour-completed">On Tour Completed</option>
                          </optgroup>
                          <optgroup label="Provider Events">
                            <option value="on-listing-approved">On Listing Approved</option>
                            <option value="7-days-before-renewal">7 Days Before Renewal</option>
                          </optgroup>
                          <optgroup label="Scheduled">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </optgroup>
                        </select>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Button 
                          onClick={() => { 
                            setEmailSubject(template.subject || template.name); 
                            setEmailBodyText(template.body || ""); 
                            setShowEmailComposer(true); 
                          }} 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs flex-1"
                          data-testid={`button-use-template-${template.id}`}
                        >
                          Use Template
                        </Button>
                        <Button 
                          onClick={() => { 
                            setEmailSubject(template.subject || template.name); 
                            setEmailBodyText(template.body || ""); 
                            setShowEmailComposer(true); 
                          }} 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          data-testid={`button-edit-template-${template.id}`}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SMS Marketing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> SMS Marketing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Select Audience</label>
                    <select value={smsAudience} onChange={(e) => setSmsAudience(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm mt-1">
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
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm" 
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
              </CardContent>
            </Card>

            {/* Automated Email Workflows - uses emailSequences from Workflow tab */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Automated Email Sequences
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Multi-email sequences sent automatically. Manage these in the Workflows tab.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Active Sequences</p>
                    <p className="text-2xl font-bold text-white">{emailSequences.filter(s => s.active).length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Total Sequences</p>
                    <p className="text-2xl font-bold text-primary">{emailSequences.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Total Emails</p>
                    <p className="text-2xl font-bold text-green-400">{emailSequences.reduce((sum, s) => sum + s.emails.length, 0)}</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {emailSequences.map((seq) => (
                    <div key={seq.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium">{seq.name}</p>
                            <Badge className={seq.active ? "bg-green-500/80" : "bg-gray-600"}>{seq.active ? "Active" : "Inactive"}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{seq.emails.length} emails in sequence</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              setEmailSequences(emailSequences.map(s => 
                                s.id === seq.id ? { ...s, active: !s.active } : s
                              ));
                            }}
                            size="sm" 
                            variant="ghost" 
                            className="text-xs h-7"
                            data-testid={`button-toggle-sequence-${seq.id}`}
                          >
                            {seq.active ? "Pause" : "Resume"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">To create or edit sequences, go to the Workflows tab.</p>
              </CardContent>
            </Card>

            {/* Automated Campaign Creation Modal */}
            {showNewAutoCampaignModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Create Automated Campaign</h2>
                    <p className="text-xs text-muted-foreground mt-1">Set up automated email sequences</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Campaign Name *</label>
                      <input 
                        type="text" 
                        value={newAutoCampaignName} 
                        onChange={(e) => setNewAutoCampaignName(e.target.value)}
                        placeholder="e.g., Welcome New Users" 
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="input-campaign-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Trigger *</label>
                      <select 
                        value={newAutoCampaignTrigger} 
                        onChange={(e) => setNewAutoCampaignTrigger(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
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
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Target Audience *</label>
                      <select 
                        value={newAutoCampaignAudience} 
                        onChange={(e) => setNewAutoCampaignAudience(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="select-audience"
                      >
                        <option value="tenants">All Tenants</option>
                        <option value="providers">All Providers</option>
                        <option value="new-users">New Users</option>
                        <option value="inactive">Inactive Users</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Number of Emails in Sequence *</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="12"
                        value={newAutoCampaignEmails} 
                        onChange={(e) => setNewAutoCampaignEmails(parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="input-email-count"
                      />
                    </div>
                  </div>
                  <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2 justify-end">
                    <Button 
                      onClick={() => setShowNewAutoCampaignModal(false)} 
                      variant="outline"
                      data-testid="button-cancel-modal"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateAutomatedCampaign} 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="button-save-automated-campaign"
                    >
                      Create Campaign
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Template Creation Modal */}
            {showNewTemplateModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Create Email Template</h2>
                    <p className="text-xs text-muted-foreground mt-1">Create a reusable template for campaigns</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Template Name *</label>
                      <input 
                        type="text" 
                        value={newTemplateName} 
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        placeholder="e.g., Welcome Email" 
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="input-template-name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Target Audience</label>
                      <select 
                        value={newTemplateAudience} 
                        onChange={(e) => setNewTemplateAudience(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="select-template-audience"
                      >
                        <option value="all">Everyone</option>
                        <option value="tenants">Tenants Only</option>
                        <option value="providers">Providers Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Auto-send Trigger (Optional)</label>
                      <select 
                        value={newTemplateTrigger} 
                        onChange={(e) => setNewTemplateTrigger(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="select-template-trigger"
                      >
                        <option value="none">Manual Only (No Trigger)</option>
                        <option value="on-provider-signup">On Provider Signup</option>
                        <option value="on-tenant-signup">On Tenant Signup</option>
                        <option value="on-application-submitted">On Application Submitted</option>
                        <option value="on-application-approved">On Application Approved</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <p className="text-xs text-muted-foreground mt-2">Leave as "Manual Only" to use this template for one-time campaigns.</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Email Subject *</label>
                      <input 
                        type="text" 
                        value={newTemplateSubject} 
                        onChange={(e) => setNewTemplateSubject(e.target.value)}
                        placeholder="e.g., Welcome to Sober Stay!" 
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                        data-testid="input-template-subject"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Email Body *</label>
                      <textarea 
                        value={newTemplateBody} 
                        onChange={(e) => setNewTemplateBody(e.target.value)}
                        placeholder="Hi [name],&#10;&#10;Write your email content here. Use [name] for personalization." 
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors resize-none"
                        data-testid="textarea-template-body"
                      />
                    </div>
                  </div>
                  <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2 justify-end">
                    <Button 
                      onClick={() => setShowNewTemplateModal(false)} 
                      variant="outline"
                      data-testid="button-cancel-template-modal"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => {
                        if (!newTemplateName.trim() || !newTemplateSubject.trim()) return;
                        const newId = marketingTemplates.length + 1;
                        setMarketingTemplates([...marketingTemplates, {
                          id: newId,
                          name: newTemplateName,
                          type: newTemplateType,
                          uses: 0,
                          trigger: newTemplateTrigger,
                          audience: newTemplateAudience,
                          subject: newTemplateSubject,
                          body: newTemplateBody
                        }]);
                        setShowNewTemplateModal(false);
                      }} 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={!newTemplateName.trim() || !newTemplateSubject.trim()}
                      data-testid="button-create-template"
                    >
                      Save Template
                    </Button>
                  </div>
                </div>
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
                  {databaseBlogPosts.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No blog posts yet. Create your first post to get started.</p>
                    </div>
                  ) : (
                    databaseBlogPosts.map((post) => (
                      <div key={post.id} className="p-4 rounded-lg bg-white/5 border border-white/10" data-testid={`blog-post-${post.id}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{post.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{post.category} • {post.author}</p>
                          </div>
                          <Badge className={post.status === "published" ? "bg-green-500/80" : post.status === "scheduled" ? "bg-blue-500/80" : "bg-gray-600"}>
                            {post.status === "published" ? "Published" : post.status === "scheduled" ? "Scheduled" : "Draft"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-300 mb-2 line-clamp-2">{post.excerpt}</div>
                        <div className="text-xs text-gray-400 mb-3">
                          {post.publishedAt ? `Published: ${new Date(post.publishedAt).toLocaleDateString()}` : `Created: ${new Date(post.createdAt).toLocaleDateString()}`}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleEditBlogPost(post)} 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs h-7"
                            data-testid={`button-edit-blog-${post.id}`}
                          >
                            Edit
                          </Button>
                          <Button 
                            onClick={() => handleDeleteBlogPost(post.id)} 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs h-7 text-red-400 hover:text-red-300"
                            data-testid={`button-delete-blog-${post.id}`}
                          >
                            Delete
                          </Button>
                          <a 
                            href={`/blog/${post.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-auto"
                          >
                            <Button size="sm" variant="ghost" className="text-xs h-7 text-primary">View</Button>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
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
                    <p className="text-white font-semibold mb-3">Active Promo Codes ({promoCodes.filter(p => p.isActive).length})</p>
                    {promoCodes.length === 0 ? (
                      <p className="text-gray-400 text-sm">No promo codes yet. Create one to get started.</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {promoCodes.map((promo) => (
                          <div key={promo.id} className="p-3 bg-background/50 rounded-lg text-xs border border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-primary font-semibold">{promo.code}</span>
                              <div className="flex items-center gap-2">
                                <Badge className={promo.isActive ? "bg-green-500/80" : "bg-gray-600"} data-testid={`badge-promo-status-${promo.id}`}>
                                  {promo.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-gray-300 mb-1">
                              {promo.discountType === "percent" ? `${promo.discountValue}% off` : `$${promo.discountValue / 100} off`}
                              {" • "}
                              {promo.target === "all" ? "Everyone" : promo.target === "providers" ? "Providers" : "Tenants"}
                            </div>
                            <div className="text-gray-400 text-xs mb-2">
                              Used: {promo.usedCount}{promo.usageLimit > 0 ? `/${promo.usageLimit}` : " (unlimited)"}
                              {promo.expiresAt && ` • Expires: ${new Date(promo.expiresAt).toLocaleDateString()}`}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleEditPromo(promo)} 
                                size="sm" 
                                variant="ghost" 
                                className="text-xs h-7"
                                data-testid={`button-edit-promo-${promo.id}`}
                              >
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleTogglePromoActive(promo)} 
                                size="sm" 
                                variant="ghost" 
                                className="text-xs h-7"
                                data-testid={`button-toggle-promo-${promo.id}`}
                              >
                                {promo.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button 
                                onClick={() => handleDeletePromo(promo.id)} 
                                size="sm" 
                                variant="ghost" 
                                className="text-xs h-7 text-red-400 hover:text-red-300"
                                data-testid={`button-delete-promo-${promo.id}`}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white font-semibold mb-3">Create Promo Code</p>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Code (e.g., SUMMER30)" 
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                        data-testid="input-promo-code"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select 
                          value={newPromoDiscountType}
                          onChange={(e) => setNewPromoDiscountType(e.target.value)}
                          className="px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                          data-testid="select-promo-discount-type"
                        >
                          <option value="percent">Percent Off</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                        <input 
                          type="number" 
                          placeholder={newPromoDiscountType === "percent" ? "% (e.g., 25)" : "Amount in cents"}
                          value={newPromoDiscountValue}
                          onChange={(e) => setNewPromoDiscountValue(e.target.value)}
                          className="px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                          data-testid="input-promo-discount-value"
                        />
                      </div>
                      <select 
                        value={newPromoTarget}
                        onChange={(e) => setNewPromoTarget(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                        data-testid="select-promo-target"
                      >
                        <option value="all">All Users</option>
                        <option value="providers">Providers Only</option>
                        <option value="tenants">Tenants Only</option>
                      </select>
                      <input 
                        type="number" 
                        placeholder="Usage Limit (0 = unlimited)" 
                        value={newPromoLimit}
                        onChange={(e) => setNewPromoLimit(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                        data-testid="input-promo-limit"
                      />
                      <input 
                        type="date" 
                        placeholder="Expiration Date (optional)"
                        value={newPromoExpiry}
                        onChange={(e) => setNewPromoExpiry(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                        data-testid="input-promo-expiry"
                      />
                      <Button 
                        onClick={handleCreatePromo} 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid="button-create-promo"
                      >
                        Create Code
                      </Button>
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
                    <select className="px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm">
                      <option>Select Ad Type</option>
                      <option>Featured Listing</option>
                      <option>Sponsored Placement</option>
                      <option>Promoted Home</option>
                    </select>
                    <input type="number" placeholder="Budget ($)" className="px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none transition-colors text-white text-sm" />
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
                {emailSequences.map((seq) => (
                  <div key={seq.id} className="rounded-lg bg-white/5 border border-white/10 overflow-hidden hover:border-primary/30 transition-colors">
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedSequence(expandedSequence === seq.id ? null : seq.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSequence === seq.id ? 'rotate-90' : ''}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">{seq.name}</p>
                            <Badge variant="outline" className="text-xs">{seq.emails.length} emails</Badge>
                            {seq.active && <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Click to view and edit individual emails</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={seq.active}
                          onChange={(e) => {
                            e.stopPropagation();
                            setEmailSequences(emailSequences.map(s => 
                              s.id === seq.id ? { ...s, active: !s.active } : s
                            ));
                          }}
                          className="w-4 h-4" 
                        />
                        <Button 
                          onClick={(e) => { e.stopPropagation(); setNewWorkflowTemplate(seq.id); setShowWorkflowModal(true); }} 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs"
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                    {expandedSequence === seq.id && (
                      <div className="border-t border-white/10 p-4 space-y-2 bg-background/30">
                        <p className="text-xs text-muted-foreground mb-3">Emails in this sequence:</p>
                        {seq.emails.map((email, idx) => (
                          <div key={email.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xs text-primary font-medium">{idx + 1}</span>
                              </div>
                              <div>
                                <p className="text-sm text-white">{email.subject}</p>
                                <p className="text-xs text-muted-foreground">
                                  {email.day === 0 ? 'Sent immediately' : email.day > 0 ? `Sent on Day ${email.day}` : `Sent ${Math.abs(email.day)} days before`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewEmail({ subject: email.subject, body: email.body });
                                  setShowEmailPreview(true);
                                }}
                                data-testid={`button-preview-email-${email.id}`}
                              >
                                <Eye className="w-3 h-3 mr-1" /> Preview
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSequenceEmail({ sequenceId: seq.id, email });
                                  setSequenceEmailSubject(email.subject);
                                  setSequenceEmailBody(email.body);
                                  setShowSequenceEmailEditor(true);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-3 h-8 text-xs gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newEmail = { 
                              id: seq.emails.length + 1, 
                              day: seq.emails.length > 0 ? seq.emails[seq.emails.length - 1].day + 7 : 0, 
                              subject: "New Email", 
                              body: "Hi [name],\n\nYour email content here..." 
                            };
                            setEmailSequences(emailSequences.map(s => 
                              s.id === seq.id ? { ...s, emails: [...s.emails, newEmail] } : s
                            ));
                          }}
                        >
                          <Plus className="w-3 h-3" /> Add Email to Sequence
                        </Button>
                      </div>
                    )}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Workflow Editor</h2>
                    <p className="text-xs text-muted-foreground mt-1">Create automated email sequences</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{newWorkflowBody.split(' ').filter(w => w).length} words</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Workflow Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter workflow name..." 
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Trigger Event</label>
                    <select 
                      value={newWorkflowTrigger}
                      onChange={(e) => setNewWorkflowTrigger(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    >
                      <option value="onSignup">On User Signup</option>
                      <option value="onApplicationApproved">Application Approved</option>
                      <option value="onApplicationSubmitted">Application Submitted</option>
                      <option value="onSubscriptionRenewal">Subscription Renewal</option>
                      <option value="onInactivity">30 Days Inactive</option>
                      <option value="manual">Manual Send</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Subject Line (What Recipients See)</label>
                  <input 
                    type="text" 
                    placeholder="Write a compelling subject line..." 
                    value={newWorkflowSubject}
                    onChange={(e) => setNewWorkflowSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Template</label>
                    <select 
                      value={newWorkflowTemplate}
                      onChange={(e) => setNewWorkflowTemplate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    >
                      <option value="welcome">Welcome</option>
                      <option value="provider-onboard">Onboarding</option>
                      <option value="app-approved">Approved</option>
                      <option value="renewal-reminder">Reminder</option>
                      <option value="success-story">Success</option>
                      <option value="blank">Blank</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Delay</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors">
                      <option>Immediately</option>
                      <option>1 hour</option>
                      <option>24 hours</option>
                      <option>3 days</option>
                      <option>7 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Priority</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Audience</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors">
                      <option>All Users</option>
                      <option>Tenants</option>
                      <option>Providers</option>
                      <option>New Users</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Status</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors">
                      <option>Active</option>
                      <option>Paused</option>
                      <option>Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Content *</label>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white">B</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white italic">I</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white underline">U</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white">Link</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white">[var]</Button>
                    </div>
                  </div>
                  <textarea 
                    placeholder="Write your email content here. Use [name], [email], [role], [property] for personalization..." 
                    value={newWorkflowBody}
                    onChange={(e) => setNewWorkflowBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors min-h-[150px] resize-none"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Tags (Comma-Separated)</label>
                    <input 
                      type="text" 
                      placeholder="onboarding, welcome, new-user" 
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Workflow ID</label>
                    <input 
                      type="text" 
                      placeholder="auto-generated" 
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-primary/20 text-muted-foreground text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-white mb-2">Workflow Preview</p>
                  <p className="text-xs text-muted-foreground">
                    This workflow will send "{newWorkflowSubject || 'your email'}" when a user {newWorkflowTrigger === 'onSignup' ? 'signs up' : newWorkflowTrigger === 'onApplicationApproved' ? 'has an approved application' : newWorkflowTrigger === 'onApplicationSubmitted' ? 'submits an application' : newWorkflowTrigger === 'onSubscriptionRenewal' ? 'renews subscription' : newWorkflowTrigger === 'onInactivity' ? 'is inactive for 30 days' : 'is manually triggered'}.
                  </p>
                </div>
              </div>

              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-3">
                <Button 
                  onClick={() => {
                    if (newWorkflowName.trim()) {
                      setWorkflows([...workflows, { 
                        name: newWorkflowName, 
                        trigger: newWorkflowTrigger, 
                        template: newWorkflowTemplate,
                        subject: newWorkflowSubject,
                        body: newWorkflowBody,
                        status: "Draft",
                        created: new Date().toLocaleDateString()
                      }]);
                      setShowWorkflowModal(false);
                      setNewWorkflowName("");
                      setNewWorkflowSubject("");
                      setNewWorkflowBody("");
                      toast({ title: "Draft Saved", description: "Workflow saved as draft" });
                    }
                  }} 
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <FileText className="w-4 h-4" /> Save Draft
                </Button>
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
                      toast({ title: "Workflow Activated", description: "Workflow is now active and will send emails automatically" });
                    }
                  }} 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Activate Workflow
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
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
              
              <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" /> Deny Document
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Select a reason for denial</p>
              </div>
              <div className="p-6">
              <p className="text-muted-foreground mb-4">
                You are denying: <span className="text-white font-medium">{viewingDocument.documentName}</span> from {viewingDocument.provider}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Select Denial Reason *</label>
                  <select
                    value={denyDocumentReason}
                    onChange={(e) => setDenyDocumentReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                  >
                    <option value="">Choose a reason...</option>
                    {documentDenialReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" /> Request More Information
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Ask provider for additional details</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground text-sm">
                  Request additional information for: <span className="text-white font-medium">{viewingDocument.documentName}</span> from {viewingDocument.provider}
                </p>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">What information do you need? *</label>
                  <textarea
                    placeholder="Please specify what additional information or documents are needed..."
                    value={requestInfoMessage}
                    onChange={(e) => setRequestInfoMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white h-24 transition-colors"
                  />
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
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

        {/* Reject Listing Modal */}
        {showRejectListingModal && rejectingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border-b border-red-500/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" /> Reject Listing
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Provide a reason for rejection</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-muted-foreground text-sm">
                  You are rejecting: <span className="text-white font-medium">{rejectingListing.name}</span>
                </p>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Rejection Reason *</label>
                  <textarea
                    placeholder="Explain why this listing is being rejected..."
                    value={rejectListingReason}
                    onChange={(e) => setRejectListingReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-red-500/30 hover:border-red-500/50 focus:border-red-500 focus:outline-none text-white h-24 transition-colors"
                    data-testid="input-reject-listing-reason"
                  />
                </div>
              </div>
              <div className="bg-background border-t border-red-500/20 px-6 py-4 flex gap-2">
                <Button 
                  onClick={handleConfirmRejectListing} 
                  disabled={!rejectListingReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                  data-testid="button-confirm-reject-listing"
                >
                  <X className="w-4 h-4" /> Confirm Rejection
                </Button>
                <Button onClick={() => {
                  setShowRejectListingModal(false);
                  setRejectingListing(null);
                  setRejectListingReason("");
                }} variant="outline" data-testid="button-cancel-reject-listing">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Listing Modal */}
        {showDeleteListingModal && deletingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border-b border-red-500/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-500" /> Delete Listing
                </h2>
                <p className="text-xs text-muted-foreground mt-1">This action cannot be undone</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-medium mb-2">Warning: This is a permanent action</p>
                  <p className="text-muted-foreground text-sm">
                    You are about to permanently delete: <span className="text-white font-medium">{deletingListing.name}</span>
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    This will remove the listing and all associated data. The provider will need to create a new listing if they want to relist the property.
                  </p>
                </div>
              </div>
              <div className="bg-background border-t border-red-500/20 px-6 py-4 flex gap-2">
                <Button 
                  onClick={handleConfirmDeleteListing}
                  className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                  data-testid="button-confirm-delete-listing"
                >
                  <Trash2 className="w-4 h-4" /> Delete Permanently
                </Button>
                <Button onClick={() => {
                  setShowDeleteListingModal(false);
                  setDeletingListing(null);
                }} variant="outline" data-testid="button-cancel-delete-listing">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Message Thread Modal */}
        {showThreadModal && viewingThread && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Message Thread
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">{viewingThread.tenant} ↔ {viewingThread.provider}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => {
                  setShowThreadModal(false);
                  setViewingThread(null);
                }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {viewingThread.messages?.map((message: any) => (
                  <div key={message.id} className={`flex ${message.isProvider ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.isProvider 
                        ? 'bg-primary/20 text-white' 
                        : 'bg-white/10 text-white'
                    }`}>
                      <p className="text-xs text-muted-foreground mb-1">{message.sender}</p>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {viewingThread.flagged && (
                <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20">
                  <p className="text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Flagged: {viewingThread.reason}
                  </p>
                </div>
              )}
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                {viewingThread.flagged && (
                  <>
                    <Button 
                      onClick={() => {
                        handleClearFlag(viewingThread.id);
                        setShowThreadModal(false);
                        setViewingThread(null);
                      }} 
                      className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Check className="w-4 h-4" /> Clear Flag
                    </Button>
                    <Button 
                      onClick={() => {
                        handleBanUser(viewingThread.id);
                        setShowThreadModal(false);
                        setViewingThread(null);
                      }} 
                      variant="outline" 
                      className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" /> Ban User
                    </Button>
                  </>
                )}
                <Button onClick={() => {
                  setShowThreadModal(false);
                  setViewingThread(null);
                }} variant="outline" className={viewingThread.flagged ? "" : "w-full"}>Close</Button>
              </div>
            </div>
          </div>
        )}

        {showBlogModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{editingBlogPostId ? "Edit Blog Post" : "Create Blog Post"}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{editingBlogPostId ? "Update your blog content" : "Create and publish blog content"}</p>
                  </div>
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
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Post Title *</label>
                    <input 
                      type="text" 
                      placeholder="Enter an engaging title..." 
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        if (!blogSlug) setBlogSlug(generateSlug(e.target.value));
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-lg font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Author</label>
                    <input 
                      type="text" 
                      placeholder="Author name" 
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Excerpt (Summary for previews)</label>
                  <textarea 
                    placeholder="Write a brief summary that will appear in article previews..." 
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white h-16 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Category</label>
                    <select 
                      value={blogCategory} 
                      onChange={(e) => setBlogCategory(e.target.value)} 
                      className="w-full px-3 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
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
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Font</label>
                    <select 
                      value={blogFont} 
                      onChange={(e) => setBlogFont(e.target.value)} 
                      className="w-full px-3 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
                    >
                      <option>Georgia</option>
                      <option>Arial</option>
                      <option>Times New Roman</option>
                      <option>Verdana</option>
                      <option>Inter</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Size</label>
                    <select 
                      value={blogFontSize} 
                      onChange={(e) => setBlogFontSize(Number(e.target.value))} 
                      className="w-full px-3 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
                    >
                      <option value={14}>Small</option>
                      <option value={16}>Medium</option>
                      <option value={18}>Large</option>
                      <option value={20}>X-Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Text Color</label>
                    <input 
                      type="color" 
                      value={blogFontColor} 
                      onChange={(e) => setBlogFontColor(e.target.value)} 
                      className="w-full h-11 rounded-lg cursor-pointer bg-background/80 border border-primary/30 hover:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Schedule</label>
                    <input 
                      type="date" 
                      value={blogScheduleDate}
                      onChange={(e) => setBlogScheduleDate(e.target.value)}
                      className="w-full px-3 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Tags (comma-separated)</label>
                    <input 
                      type="text" 
                      placeholder="recovery, sobriety, mental health..." 
                      value={blogTags}
                      onChange={(e) => setBlogTags(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">URL Slug</label>
                    <input 
                      type="text" 
                      placeholder="custom-url-slug" 
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Content *</label>
                  <div className="border border-primary/30 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-background/50 border-b border-primary/20">
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("**")} className="h-8 w-8 p-0" title="Bold">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("*")} className="h-8 w-8 p-0" title="Italic">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("~~")} className="h-8 w-8 p-0" title="Strikethrough">
                        <Strikethrough className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-primary/30 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("# ", "")} className="h-8 w-8 p-0" title="Heading 1">
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("## ", "")} className="h-8 w-8 p-0" title="Heading 2">
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-primary/30 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("- ", "")} className="h-8 w-8 p-0" title="Bullet List">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("1. ", "")} className="h-8 w-8 p-0" title="Numbered List">
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("> ", "")} className="h-8 w-8 p-0" title="Quote">
                        <Quote className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-primary/30 mx-1" />
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
                      className="w-full px-4 py-4 bg-background/80 text-white h-64 resize-none border-0 focus:outline-none focus:ring-0"
                      style={{ fontFamily: blogFont, fontSize: `${blogFontSize}px`, color: blogFontColor }}
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</p>
                    {blogCategory && (
                      <Badge className="bg-primary/20 text-primary text-xs">{blogCategory}</Badge>
                    )}
                  </div>
                  <div className="p-6 bg-background/50 rounded-lg border border-primary/20 min-h-32">
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
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/20">
                        {blogTags.split(",").map((tag, i) => (
                          <span key={i} className="text-xs bg-primary/20 px-2 py-1 rounded">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={handleSaveBlog} className="flex-1 bg-gray-600 hover:bg-gray-700 gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
                <Button onClick={handlePublishBlog} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <CheckCircle className="w-4 h-4" /> {editingBlogPostId ? "Update Post" : (blogScheduleDate ? "Schedule" : "Publish Now")}
                </Button>
                <Button onClick={() => { setShowBlogModal(false); setEditingBlogPostId(null); }} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showNewCampaignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Create New Campaign</h2>
                <p className="text-xs text-muted-foreground mt-1">Set up a new email campaign</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Campaign Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter a descriptive campaign name..." 
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Recipient Group *</label>
                  <select 
                    value={newCampaignRecipients}
                    onChange={(e) => setNewCampaignRecipients(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                  >
                    <option>All Tenants</option>
                    <option>All Providers</option>
                    <option>Active Subscribers</option>
                    <option>Inactive Users</option>
                  </select>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2 justify-end">
                <Button onClick={() => setShowNewCampaignModal(false)} variant="outline">Cancel</Button>
                <Button onClick={handleSaveNewCampaign} className="bg-primary text-primary-foreground hover:bg-primary/90">Create Campaign</Button>
              </div>
            </div>
          </div>
        )}

        {editingCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Edit Campaign</h2>
                <p className="text-xs text-muted-foreground mt-1">Modify campaign settings</p>
              </div>
              <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Campaign Name</label>
                  <input 
                    type="text" 
                    defaultValue={editingCampaign.name}
                    id="campaign-name"
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Status</label>
                  <select id="campaign-status" className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors" defaultValue={editingCampaign.status}>
                    <option>Active</option>
                    <option>Scheduled</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Recipients: {editingCampaign.recipients}</label>
                  <select id="campaign-recipients" className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white mt-1 transition-colors">
                    <option>All Tenants</option>
                    <option>All Providers</option>
                    <option>Active Subscribers</option>
                    <option>Inactive Users</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Subject/Preview</label>
                  <input type="text" placeholder="Email subject" className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors" />
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={() => handleSaveCampaign({ name: (document.getElementById("campaign-name") as HTMLInputElement)?.value, status: (document.getElementById("campaign-status") as HTMLSelectElement)?.value })} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
                <Button onClick={() => setEditingCampaign(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {editingListing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Manage Featured Listing</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure boost options</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
                  <p className="text-white font-medium">{editingListing.provider}</p>
                  <p className="text-muted-foreground text-sm">{editingListing.listing}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Boost Level</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors">
                    <option>2x Visibility - $49/week</option>
                    <option>3x Visibility - $99/week</option>
                    <option>Top Placement - $149/week</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Duration</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                  </select>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={handleCloseListing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Apply</Button>
                <Button onClick={() => setEditingListing(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showSupportDetailsModal && viewingSupportTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Ticket Details</h2>
                <p className="text-xs text-muted-foreground mt-1">Support request information</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Ticket ID</p>
                  <p className="text-white font-medium">{viewingSupportTicket.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">From</p>
                  <p className="text-white font-medium">{viewingSupportTicket.user}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Subject</p>
                  <p className="text-white font-medium">{viewingSupportTicket.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Message</p>
                  <div className="bg-background/50 border border-primary/20 p-3 rounded-lg">
                    <p className="text-sm text-white">{viewingSupportTicket.message}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Status</p>
                  <Badge className={
                    viewingSupportTicket.status === "Open" ? "bg-blue-500/80" :
                    viewingSupportTicket.status === "In Progress" ? "bg-amber-500/80" :
                    "bg-green-500/80"
                  }>{viewingSupportTicket.status}</Badge>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={() => setShowSupportDetailsModal(false)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Close</Button>
              </div>
            </div>
          </div>
        )}

        {showReplyModal && viewingSupportTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Reply to {viewingSupportTicket.id}</h2>
                <p className="text-xs text-muted-foreground mt-1">Send a response to support request</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Message</label>
                  <textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    rows={4}
                  />
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={() => { setShowReplyModal(false); setReplyMessage(""); }} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Send Reply</Button>
                <Button onClick={() => { setShowReplyModal(false); setReplyMessage(""); }} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showComposeEmailModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Send Email to All Subscribers</h2>
                <p className="text-xs text-muted-foreground mt-1">This email will be sent to all {emailSubscribers.filter(s => s.status === "Active").length} active subscribers</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    placeholder="Enter email subject..."
                    value={composeEmailSubject}
                    onChange={(e) => setComposeEmailSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    data-testid="input-email-subject"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Message</label>
                  <textarea
                    placeholder="Type your email message..."
                    value={composeEmailBody}
                    onChange={(e) => setComposeEmailBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    rows={6}
                    data-testid="input-email-body"
                  />
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button 
                  onClick={handleSendBulkEmail} 
                  disabled={sendingBulkEmail || !composeEmailSubject || !composeEmailBody}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-send-bulk-email"
                >
                  {sendingBulkEmail ? "Sending..." : "Send Email"}
                </Button>
                <Button 
                  onClick={() => { setShowComposeEmailModal(false); setComposeEmailSubject(""); setComposeEmailBody(""); }} 
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showBlogEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Content Editor</h2>
                    <p className="text-xs text-muted-foreground mt-1">Create and edit blog posts</p>
                  </div>
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
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Post Title *</label>
                    <input 
                      type="text" 
                      placeholder="Enter an engaging title..." 
                      value={blogTitle}
                      onChange={(e) => {
                        setBlogTitle(e.target.value);
                        if (!blogSlug) setBlogSlug(generateSlug(e.target.value));
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-lg font-medium transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Author</label>
                    <input 
                      type="text" 
                      placeholder="Author name" 
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Content *</label>
                  <div className="border border-primary/30 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-background/50 border-b border-primary/20">
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("**")} className="h-8 w-8 p-0" title="Bold">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("*")} className="h-8 w-8 p-0" title="Italic">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("~~")} className="h-8 w-8 p-0" title="Strikethrough">
                        <Strikethrough className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-primary/30 mx-1" />
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("# ", "")} className="h-8 w-8 p-0" title="Heading 1">
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => insertFormatting("## ", "")} className="h-8 w-8 p-0" title="Heading 2">
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-primary/30 mx-1" />
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
                      className="w-full px-4 py-4 bg-background/80 text-white h-64 resize-none border-0 focus:outline-none focus:ring-0"
                      style={{ fontFamily: blogFont, fontSize: `${blogFontSize}px`, color: blogFontColor }}
                    />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Live Preview</p>
                  <div className="p-6 bg-background/50 rounded-lg border border-primary/20 min-h-32">
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
              
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={handleSaveBlog} className="flex-1 bg-gray-600 hover:bg-gray-700 gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
                <Button onClick={handlePublishBlog} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <CheckCircle className="w-4 h-4" /> Publish Now
                </Button>
                <Button onClick={() => setShowBlogEditor(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showSequenceEmailEditor && editingSequenceEmail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Sequence Email Editor</h2>
                    <p className="text-xs text-muted-foreground mt-1">Edit email #{editingSequenceEmail.email.id} in sequence</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{sequenceEmailBody.split(' ').filter((w: string) => w).length} words</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Subject Line *</label>
                    <input 
                      type="text" 
                      value={sequenceEmailSubject}
                      onChange={(e) => setSequenceEmailSubject(e.target.value)}
                      placeholder="Enter subject line..." 
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Send Timing</label>
                    <select 
                      defaultValue={editingSequenceEmail.email.day}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                    >
                      <option value={0}>Immediately</option>
                      <option value={1}>Day 1</option>
                      <option value={3}>Day 3</option>
                      <option value={5}>Day 5</option>
                      <option value={7}>Day 7</option>
                      <option value={10}>Day 10</option>
                      <option value={14}>Day 14</option>
                      <option value={21}>Day 21</option>
                      <option value={-7}>7 days before</option>
                      <option value={-3}>3 days before</option>
                      <option value={-1}>1 day before</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Font</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors">
                      <option>Arial</option>
                      <option>Georgia</option>
                      <option>Verdana</option>
                      <option>Trebuchet MS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Size</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors">
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Text Color</label>
                    <input 
                      type="color" 
                      defaultValue="#ffffff"
                      className="w-full h-11 rounded-lg bg-background/80 border border-primary/30 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Preview</label>
                    <Button variant="outline" className="w-full h-11">Preview</Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Content *</label>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white">B</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white italic">I</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white underline">U</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white">Link</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-white">[var]</Button>
                    </div>
                  </div>
                  <textarea 
                    value={sequenceEmailBody}
                    onChange={(e) => setSequenceEmailBody(e.target.value)}
                    placeholder="Write your email content. Use [name], [email], [role] for personalization..." 
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors min-h-[200px] resize-none"
                    rows={8}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Live Preview</label>
                  <div className="p-4 rounded-lg bg-white/5 border border-primary/20 min-h-32">
                    <p className="text-sm font-semibold text-white mb-2">{sequenceEmailSubject || "Subject line..."}</p>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {sequenceEmailBody || "Your email content will appear here..."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-3">
                <Button 
                  onClick={() => {
                    setEmailSequences(emailSequences.map(seq => 
                      seq.id === editingSequenceEmail.sequenceId 
                        ? {
                            ...seq,
                            emails: seq.emails.map(email => 
                              email.id === editingSequenceEmail.email.id 
                                ? { ...email, subject: sequenceEmailSubject, body: sequenceEmailBody }
                                : email
                            )
                          }
                        : seq
                    ));
                    setShowSequenceEmailEditor(false);
                    setEditingSequenceEmail(null);
                    toast({ title: "Email Saved", description: "Sequence email updated successfully" });
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Save Changes
                </Button>
                <Button 
                  onClick={() => {
                    setShowSequenceEmailEditor(false);
                    setEditingSequenceEmail(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {showEmailPreview && previewEmail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEmailPreview(false)}>
            <div 
              className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Email Preview</h2>
                    <p className="text-xs text-muted-foreground mt-1">Preview how this email will appear to recipients</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowEmailPreview(false)}
                    className="text-muted-foreground hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-primary px-6 py-4">
                    <p className="text-xs text-primary-foreground/80 mb-1">From: Sober Stay &lt;noreply@soberstay.com&gt;</p>
                    <p className="text-xs text-primary-foreground/80">To: [recipient email]</p>
                  </div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <p className="text-lg font-semibold text-gray-900">{previewEmail.subject}</p>
                  </div>
                  <div className="px-6 py-6 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {previewEmail.body}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                      Sober Stay Recovery Housing Platform<br />
                      <span className="text-primary">www.soberstay.com</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background border-t border-primary/20 px-6 py-4 flex justify-end">
                <Button 
                  onClick={() => setShowEmailPreview(false)}
                  variant="outline"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}

        {showEmailComposer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Email Composer</h2>
                    <p className="text-xs text-muted-foreground mt-1">Design professional email campaigns</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{emailBodyText.length} characters</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Subject and Recipient Group - 2 column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Subject *</label>
                    <input 
                      type="text" 
                      value={emailSubject} 
                      onChange={(e) => setEmailSubject(e.target.value)} 
                      placeholder="Enter a compelling subject line..." 
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                      data-testid="input-email-subject"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Recipient Group</label>
                    <select 
                      value={emailRecipientGroup}
                      onChange={(e) => setEmailRecipientGroup(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-sm transition-colors"
                      data-testid="select-recipient-group"
                    >
                      <option value="all">All Users</option>
                      <option value="tenants">All Tenants</option>
                      <option value="providers">All Providers</option>
                    </select>
                  </div>
                </div>
                
                {/* Formatting Controls - 4 column grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Font</label>
                    <select 
                      value={emailFont} 
                      onChange={(e) => setEmailFont(e.target.value)} 
                      className="w-full px-3 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
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
                      className="w-full px-3 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white text-xs transition-colors"
                      data-testid="select-size"
                    >
                      <option value={14}>Small</option>
                      <option value={16}>Medium</option>
                      <option value={18}>Large</option>
                      <option value={20}>X-Large</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Text Color</label>
                    <input 
                      type="color" 
                      value={emailFontColor} 
                      onChange={(e) => setEmailFontColor(e.target.value)} 
                      className="w-full h-11 rounded-lg cursor-pointer bg-background/80 border border-primary/30 hover:border-primary/50 transition-colors"
                      data-testid="input-color"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Preview</label>
                    <div className="w-full h-11 rounded-lg bg-background/80 border border-primary/30 flex items-center justify-center px-3" style={{ fontSize: `${emailFontSize * 0.65}px`, fontFamily: emailFont, color: emailFontColor }}>
                      Abc
                    </div>
                  </div>
                </div>
                
                {/* Email Content */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Content *</label>
                  <div className="border border-primary/30 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-background/50 border-b border-primary/20">
                      <span className="text-xs text-muted-foreground px-2">HTML supported</span>
                      <div className="flex-1" />
                    </div>
                    <textarea
                      placeholder="Write your email message here..."
                      value={emailBodyText}
                      onChange={(e) => setEmailBodyText(e.target.value)}
                      className="w-full px-4 py-4 bg-background/80 text-white h-56 resize-none border-0 focus:outline-none focus:ring-0"
                      style={{ fontFamily: emailFont, fontSize: `${emailFontSize}px`, color: emailFontColor }}
                      data-testid="textarea-content"
                    />
                  </div>
                </div>
                
                {/* Live Preview */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Live Preview</p>
                  <div className="p-6 bg-background/50 rounded-lg border border-primary/20 min-h-40 max-h-48 overflow-auto" style={{ fontFamily: emailFont, fontSize: `${emailFontSize}px`, color: emailFontColor, lineHeight: "1.6" }}>
                    {emailBodyText || "Your email content will appear here..."}
                  </div>
                </div>
              </div>
              
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button 
                  onClick={() => setShowEmailComposer(false)} 
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                  data-testid="button-cancel-email"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendCampaign}
                  disabled={isSendingEmail || !emailSubject.trim() || !emailBodyText.trim()}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-send-email"
                >
                  {isSendingEmail ? "Sending..." : "Send Campaign"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {showComplianceDetailsModal && viewingComplianceIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Compliance Issue Details</h2>
                <p className="text-xs text-muted-foreground mt-1">Review compliance requirements</p>
              </div>
              <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Provider</p>
                  <p className="text-white font-medium">{viewingComplianceIssue.provider}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Issue</p>
                  <p className="text-white font-medium">{viewingComplianceIssue.issue}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Current Status</p>
                  <Badge className={`${
                    viewingComplianceIssue.status === "Urgent" ? "bg-red-500/80" :
                    viewingComplianceIssue.status === "Reminder Sent" ? "bg-green-500/80" :
                    viewingComplianceIssue.status === "Update Requested" ? "bg-green-500/80" :
                    "bg-amber-500/80"
                  }`}>{viewingComplianceIssue.status}</Badge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Details</p>
                  <p className="text-sm text-gray-300">
                    {viewingComplianceIssue.issue.includes("Fire") 
                      ? "Property inspection is required annually. The last fire inspection was conducted 90 days ago and is due for renewal. Contact the provider to schedule the inspection immediately."
                      : "The provider's insurance certificate expired on November 15, 2024. An updated and valid certificate must be uploaded within 48 hours to maintain compliance and active listing status."}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Required Action</p>
                  <p className="text-sm text-white">
                    {viewingComplianceIssue.status === "Pending" 
                      ? "Send a reminder email to the provider requesting immediate compliance."
                      : viewingComplianceIssue.status === "Urgent"
                      ? "Request updated documentation from the provider immediately. Consider suspension if not resolved within 48 hours."
                      : "Monitor for compliance. Documentation has been requested."}
                  </p>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={() => setShowComplianceDetailsModal(false)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Close</Button>
              </div>
            </div>
          </div>
        )}

        {showSubscriptionWaiverModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Waive Monthly Subscription</h2>
                <p className="text-xs text-muted-foreground mt-1">Exempt provider from subscription fee</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-sm text-amber-200">Admin Action: This provider will be exempt from the $49/month subscription fee.</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 border border-primary/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider</p>
                  <p className="text-white font-semibold">{waivingProvider}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Reason for Waiver</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors">
                    <option>Partnership Agreement</option>
                    <option>Promotional Period</option>
                    <option>Community Benefit</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Duration</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors">
                    <option>Permanent</option>
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>1 Year</option>
                  </select>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={handleConfirmWaiver} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Confirm Waiver</Button>
                <Button onClick={() => setShowSubscriptionWaiverModal(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showPromoModal && editingPromo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="promo-edit-modal">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Edit Promo Code</h2>
                <p className="text-xs text-muted-foreground mt-1">Modify promo code settings</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Code</label>
                  <input 
                    type="text" 
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="input-edit-promo-code"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Discount Type</label>
                    <select 
                      value={newPromoDiscountType}
                      onChange={(e) => setNewPromoDiscountType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                      data-testid="select-edit-promo-discount-type"
                    >
                      <option value="percent">Percent Off</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Value</label>
                    <input 
                      type="number" 
                      value={newPromoDiscountValue}
                      onChange={(e) => setNewPromoDiscountValue(e.target.value)}
                      placeholder={newPromoDiscountType === "percent" ? "%" : "cents"}
                      className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                      data-testid="input-edit-promo-discount-value"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Target Audience</label>
                  <select 
                    value={newPromoTarget}
                    onChange={(e) => setNewPromoTarget(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="select-edit-promo-target"
                  >
                    <option value="all">All Users</option>
                    <option value="providers">Providers Only</option>
                    <option value="tenants">Tenants Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Usage Limit (0 = unlimited)</label>
                  <input 
                    type="number" 
                    value={newPromoLimit}
                    onChange={(e) => setNewPromoLimit(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="input-edit-promo-limit"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Expiration Date</label>
                  <input 
                    type="date" 
                    value={newPromoExpiry}
                    onChange={(e) => setNewPromoExpiry(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="input-edit-promo-expiry"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={newPromoActive}
                    onChange={(e) => setNewPromoActive(e.target.checked)}
                    className="w-4 h-4 rounded"
                    data-testid="checkbox-edit-promo-active"
                  />
                  <label className="text-sm text-white">Active</label>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button onClick={handleSavePromo} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-save-promo">Save Changes</Button>
                <Button onClick={() => { setShowPromoModal(false); setEditingPromo(null); }} variant="outline" data-testid="button-cancel-promo">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {showPartnerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="partner-modal">
            <div className="bg-gradient-to-b from-card to-background border border-primary/20 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{editingPartner ? "Edit Partner" : "Add Partner"}</h2>
                <p className="text-xs text-muted-foreground mt-1">{editingPartner ? "Update partner information" : "Add a new recovery partner or resource"}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Partner Name *</label>
                  <input 
                    type="text" 
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g., SAMHSA, New Hope Treatment Center"
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="input-partner-name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Category *</label>
                  <select 
                    value={partnerCategory}
                    onChange={(e) => setPartnerCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="select-partner-category"
                  >
                    <option value="organization">Organization</option>
                    <option value="treatment">Treatment Center</option>
                    <option value="blog">Blog/Resource</option>
                    <option value="hotline">Hotline</option>
                    <option value="association">Association</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Description</label>
                  <textarea 
                    value={partnerDescription}
                    onChange={(e) => setPartnerDescription(e.target.value)}
                    placeholder="Brief description of the partner organization..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors resize-none"
                    data-testid="input-partner-description"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Website URL</label>
                  <input 
                    type="url" 
                    value={partnerWebsite}
                    onChange={(e) => setPartnerWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="input-partner-website"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Focus Areas (comma-separated)</label>
                  <input 
                    type="text" 
                    value={partnerFocus.join(", ")}
                    onChange={(e) => setPartnerFocus(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                    placeholder="e.g., Alcohol, Opioids, Mental Health"
                    className="w-full px-4 py-3 rounded-lg bg-background/80 border border-primary/30 hover:border-primary/50 focus:border-primary focus:outline-none text-white transition-colors"
                    data-testid="input-partner-focus"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={partnerIsActive}
                    onChange={(e) => setPartnerIsActive(e.target.checked)}
                    className="w-4 h-4 rounded"
                    data-testid="checkbox-partner-active"
                  />
                  <label className="text-sm text-white">Active (visible on public partners page)</label>
                </div>
              </div>
              <div className="bg-background border-t border-primary/20 px-6 py-4 flex gap-2">
                <Button 
                  onClick={async () => {
                    if (!partnerName.trim()) {
                      toast({ title: "Error", description: "Partner name is required", variant: "destructive" });
                      return;
                    }
                    try {
                      const partnerData = {
                        name: partnerName.trim(),
                        category: partnerCategory,
                        description: partnerDescription.trim() || null,
                        website: partnerWebsite.trim() || null,
                        focus: partnerFocus.length > 0 ? partnerFocus : null,
                        isActive: partnerIsActive
                      };
                      
                      if (editingPartner) {
                        const res = await fetch(`/api/admin/partners/${editingPartner.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify(partnerData)
                        });
                        if (res.ok) {
                          const updated = await res.json();
                          setPartners(partners.map(p => p.id === editingPartner.id ? updated : p));
                          toast({ title: "Partner Updated", description: `${partnerName} has been updated.` });
                        }
                      } else {
                        const res = await fetch('/api/admin/partners', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify(partnerData)
                        });
                        if (res.ok) {
                          const newPartner = await res.json();
                          setPartners([...partners, newPartner]);
                          toast({ title: "Partner Added", description: `${partnerName} has been added.` });
                        }
                      }
                      setShowPartnerModal(false);
                      setEditingPartner(null);
                    } catch (error) {
                      toast({ title: "Error", description: "Failed to save partner", variant: "destructive" });
                    }
                  }} 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" 
                  data-testid="button-save-partner"
                >
                  {editingPartner ? "Save Changes" : "Add Partner"}
                </Button>
                <Button onClick={() => { setShowPartnerModal(false); setEditingPartner(null); }} variant="outline" data-testid="button-cancel-partner">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
