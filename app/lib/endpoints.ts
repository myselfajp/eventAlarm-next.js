"use client";

const API_V1_BASE = (process.env.NEXT_PUBLIC_API_V1_BASE || "").replace(
  /\/+$/,
  ""
);
const API_ASSETS_URL = (process.env.NEXT_PUBLIC_API_ASSETS_BASE || "").replace(
  /\/+$/,
  ""
);

if (!API_V1_BASE) throw new Error("NEXT_PUBLIC_API_V1_BASE is required");

const AUTH_API = `${API_V1_BASE}/auth`;
const REFERENCE_DATA_API = `${API_V1_BASE}/reference-data`;
const PARTICIPANT_DATA_API = `${API_V1_BASE}/participant`;
const COACH_DATA_API = `${API_V1_BASE}/coach`;
const FACILITY_API = `${API_V1_BASE}/facility`;
const COMPANY_API = `${API_V1_BASE}/company`;

export const EP = {
  API_BASE: API_V1_BASE,
  API_ASSETS_BASE: API_ASSETS_URL,
  AUTH: {
    signIn: `${AUTH_API}/sign-in`,
    signUp: `${AUTH_API}/sign-up`,
    refresh: `${AUTH_API}/refresh`,
    me: `${AUTH_API}/get-current-user`,
    editUserPhoto: `${AUTH_API}/edit-user-photo`,
    getUsers: `${AUTH_API}/get-user`,
    getUserById: (userId: string) => `${AUTH_API}/get-user/${userId}`,
  },
  REFERENCE: {
    sportGroup: `${REFERENCE_DATA_API}/get-sport-group`,
    sport: `${REFERENCE_DATA_API}/get-sport`,
    sportGoal: `${REFERENCE_DATA_API}/get-sport-goal`,
    sportGoalById: (sportGoalId: string) =>
      `${REFERENCE_DATA_API}/get-sport-goal/${sportGoalId}`,
  },
  PARTICIPANT: {
    createProfile: `${PARTICIPANT_DATA_API}/create-profile`,
    editProfile: `${PARTICIPANT_DATA_API}/edit-profile`,
    getDetails: (participantId: string) =>
      `${PARTICIPANT_DATA_API}/get-by-detail/${participantId}`,
  },
  COACH: {
    createProfileAndBranch: `${COACH_DATA_API}/create-branch`,
    editProfileAndBranch: `${COACH_DATA_API}/edit-branch`,
    editCoach: `${COACH_DATA_API}/edit-coach`,
    createEvent: `${COACH_DATA_API}/create-event`,
    getCurrentBranches: `${COACH_DATA_API}/current-branches`,
    getCoachDetails: `${COACH_DATA_API}/get-by-detail`,
    getCoachById: (coachId: string) =>
      `${COACH_DATA_API}/get-by-detail/${coachId}`,
    getCoachList: `${API_V1_BASE}/get-coach-list`,
  },
   PARTICIPANT_LIST: {
    getParticipantList: `${API_V1_BASE}/get-participant-list`,
  }, 
  FACILITY: {
    base: `${API_V1_BASE}/facility`,
    getFacility: `${API_V1_BASE}/get-facility`,
    createFacility: `${API_V1_BASE}/facility/create-facility`,
    editFacility: (id: string) => `${API_V1_BASE}/facility/${id}`,
    deleteFacility: (id: string) => `${API_V1_BASE}/facility/${id}`,
  },
  COMPANY: {
    getCompany: `${API_V1_BASE}/get-company`,
    createCompany: `${COMPANY_API}/create-company`,
    editCompany: (id: string) => `${COMPANY_API}/${id}`,
    deleteCompany: (id: string) => `${COMPANY_API}/${id}`,
  },
  SALON: {
    getSalon: `${API_V1_BASE}/get-salon`,
    getSalonsByFacility: (facilityId: string) =>
      `${API_V1_BASE}/get-salon/${facilityId}`,
  },
  CLUB: { getClub: `${API_V1_BASE}/get-club` },
  CLUB_GROUPS: { getClubGroups: `${API_V1_BASE}/get-group` },
  EVENT_STYLE: { getEventStyle: `${API_V1_BASE}/get-event-style` },
  EVENTS: { getEvents: `${API_V1_BASE}/get-event` },
};
