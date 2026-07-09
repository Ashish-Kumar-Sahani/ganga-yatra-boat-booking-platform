export type InspectionResult = "PASS" | "WARNING" | "FAIL";

export interface InspectionChecklist {
  lifeJacketsAvailable: boolean;
  fireExtinguisherAvailable: boolean;
  firstAidKitAvailable: boolean;
  boatFitnessCondition: boolean;
  engineCondition: boolean;
  navigationLight: boolean;
  overloadingRisk: boolean;
  emergencyContactVisible: boolean;
  crewLicenseVerified: boolean;
  insuranceVerified: boolean;
  permitVerified: boolean;
}

export interface Inspection {
  _id: string;
  boatId: {
    _id: string;
    boatName: string;
    boatNumber: string;
  };
  cityId: string;
  inspectorId: {
    _id: string;
    name: string;
    email: string;
  };
  inspectorName: string;
  checklist: InspectionChecklist;
  result: InspectionResult;
  score: number;
  remarks: string;
  nextInspectionDueDate: string;
  photoUrl?: string | null;
  certificateUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
