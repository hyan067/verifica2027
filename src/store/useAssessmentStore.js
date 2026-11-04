import { create } from 'zustand';
import { generateEligibilityReport } from '../lib/eligibilityLogic.js';

/** Sem middleware persist: nada vai a localStorage, cookies ou servidor. */
export const useAssessmentStore = create((set) => ({
  profile: null,
  report: null,
  reportUnlocked: false,
  reportMode: null,
  saveAssessment: (profile) => set({
    profile: { ...profile },
    report: generateEligibilityReport(profile),
    reportUnlocked: false,
    reportMode: null,
  }),
  unlockDemo: () => set({ reportUnlocked: true, reportMode: 'demo' }),
  unlockVerifiedPayment: () => set({ reportUnlocked: true, reportMode: 'verified' }),
  clear: () => set({ profile: null, report: null, reportUnlocked: false, reportMode: null }),
}));
