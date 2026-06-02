import { currentUser } from "@/data/mockData";
import { useLearnerProfile } from "@/contexts/AuthContext";

/** Merges authenticated profile with mock defaults for gradual migration. */
export function useLearnerDisplay() {
  const profile = useLearnerProfile();

  if (profile) {
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      cohort: profile.cohortCode ?? currentUser.cohort,
      cohortName: profile.cohortName ?? currentUser.cohortName,
      day: profile.programDay,
      totalDays: profile.totalDays,
      goal: profile.goal,
      level: profile.level,
      city: profile.city ?? currentUser.city,
      isAuthenticated: true,
    };
  }

  return {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    cohort: currentUser.cohort,
    cohortName: currentUser.cohortName,
    day: currentUser.day,
    totalDays: currentUser.totalDays,
    goal: currentUser.goal,
    level: currentUser.level,
    city: currentUser.city,
    isAuthenticated: false,
  };
}
