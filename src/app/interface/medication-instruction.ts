export interface MedicationInstruction {
  _id: string;
  instruction: string;
  details?: MedicationInstructionDetails;
}

export interface MedicationInstructionDetails {
  duration?: string;
  breakfast?: {
    before?: string;
    after?: string;
  };
  lunch?: {
    before?: string;
    after?: string
  };
  dinner?: {
    before?: string;
    after?: string;
  };
}
