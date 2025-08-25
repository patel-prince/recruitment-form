import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export interface FormSubmissionData {
  timestamp: any;
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    city: string;
    state: string;
    maritalStatus: string;
    nationality: string;
    language: string;
    linkedInProfile: string;
  };
  educationDetails: Array<{
    school: string;
    degree: string;
    course: string;
    year: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    currentlyWorking: string;
    description: string;
  }>;
  skills: {
    technicalSkills: string[];
    softSkills: string[];
  };
  otherDetails: {
    interests: string[];
    githubProfile: string;
    portfolioWebsite: string;
    projects: string[];
    references: string[];
    resumeFileName: string;
  };
  gapExplanation?: string;
}

export const submitFormToFirebase = async (formData: FormSubmissionData) => {
  try {
    // Debug: Log the data being sent to Firebase
    console.log('Data being sent to Firebase:', JSON.stringify(formData, null, 2))
    
    const docRef = await addDoc(collection(db, "recruitment-submissions"), {
      ...formData,
      submittedAt: serverTimestamp(),
    });
    
    console.log('Document created with ID:', docRef.id)
    
    return {
      success: true,
      documentId: docRef.id,
      message: "Form submitted successfully!"
    };
  } catch (error) {
    console.error("Error submitting form to Firebase:", error);
    throw new Error("Failed to submit form to database");
  }
}; 