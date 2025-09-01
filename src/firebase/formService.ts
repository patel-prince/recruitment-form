import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { sendFormSubmissionEmail, type EmailData } from "../services/emailService";

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
    technicalSkills: string;
    softSkills: string;
  };
  otherDetails: {
    interests: string;
    githubProfile: string;
    portfolioWebsite: string;
    projects: string;
    references: string[];
    resumeFileName: string;
    resumeUrl: string; // Cloudinary secure URL for direct access
    cloudinaryData: {
      public_id: string;
      secure_url: string;
      url: string;
      format: string;
      resource_type: string;
      created_at: string;
      bytes: number;
    } | null;
  };
  gapExplanation: string;
}

export const submitFormToFirebase = async (formData: FormSubmissionData) => {
  try {
    // Submit to Firebase
    const docRef = await addDoc(collection(db, "recruitment-submissions"), {
      ...formData,
      submittedAt: serverTimestamp(),
    });
    
    // Send email notification
    try {
      const emailResult = await sendFormSubmissionEmail(formData as EmailData);
      console.log('Email result:', emailResult);
    } catch (emailError) {
      console.error('Email sending failed, but form was saved:', emailError);
      // Don't throw error here - form submission should succeed even if email fails
    }
    
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