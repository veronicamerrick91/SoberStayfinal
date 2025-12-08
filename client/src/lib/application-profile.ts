export interface ApplicationProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  currentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  primarySubstances: string;
  ageOfFirstUse: string;
  lastDateOfUse: string;
  lengthOfSobriety: string;
  overdoseHistory: string;
  overdoseDate: string;
  matHistory: string;
  currentMatMedications: string;
  hasSponsor: string;
  medicalConditions: string;
  mentalHealthDiagnoses: string;
  currentMedications: string;
  allergies: string;
  mobilityIssues: string;
  seizureHistory: string;
  isPregnant: string;
  onProbationParole: string;
  probationDetails: string;
  pendingCourtCases: string;
  restrainingOrders: string;
  violentOffenses: string;
}

export interface SubmittedApplication {
  id: string;
  propertyId: string;
  propertyName: string;
  submittedAt: string;
  status: "pending" | "under_review" | "approved" | "denied" | "action_required";
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  applicationData: ApplicationProfile;
}

const PROFILE_KEY = "sober_stay_application_profile";
const APPLICATIONS_KEY = "sober_stay_submitted_applications";

export function getSavedProfile(): ApplicationProfile | null {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: ApplicationProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

export function getSubmittedApplications(): SubmittedApplication[] {
  try {
    const saved = localStorage.getItem(APPLICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addSubmittedApplication(application: SubmittedApplication): void {
  const applications = getSubmittedApplications();
  applications.push(application);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

export function updateApplicationStatus(
  applicationId: string, 
  status: SubmittedApplication["status"],
  reviewedBy?: string,
  reviewNotes?: string
): void {
  const applications = getSubmittedApplications();
  const index = applications.findIndex(a => a.id === applicationId);
  if (index !== -1) {
    applications[index].status = status;
    applications[index].reviewedAt = new Date().toISOString();
    if (reviewedBy) applications[index].reviewedBy = reviewedBy;
    if (reviewNotes) applications[index].reviewNotes = reviewNotes;
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  }
}

export function getApplicationById(applicationId: string): SubmittedApplication | null {
  const applications = getSubmittedApplications();
  return applications.find(a => a.id === applicationId) || null;
}

export function getEmptyProfile(): ApplicationProfile {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    currentAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    primarySubstances: "",
    ageOfFirstUse: "",
    lastDateOfUse: "",
    lengthOfSobriety: "",
    overdoseHistory: "",
    overdoseDate: "",
    matHistory: "",
    currentMatMedications: "",
    hasSponsor: "",
    medicalConditions: "",
    mentalHealthDiagnoses: "",
    currentMedications: "",
    allergies: "",
    mobilityIssues: "",
    seizureHistory: "",
    isPregnant: "",
    onProbationParole: "",
    probationDetails: "",
    pendingCourtCases: "",
    restrainingOrders: "",
    violentOffenses: "",
  };
}

export function initializeSampleApplications(): void {
  // No sample data - only real applications from user submissions
}
