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

export const EP = {
    API_BASE: API_V1_BASE,
    API_ASSETS_BASE: API_ASSETS_URL,
    AUTH: {
        signIn: `${AUTH_API}/sign-in`,
        signUp: `${AUTH_API}/sign-up`,
        refresh: `${AUTH_API}/refresh`,
        me: `${AUTH_API}/get-current-user`,
    },
    REFERENCE: {
        sportGroup: `${REFERENCE_DATA_API}/get-sport-group`,
        sport: `${REFERENCE_DATA_API}/get-sport`,
        sportGoal: `${REFERENCE_DATA_API}/get-sport-goal`,
    },
    PARTICIPANT: {
        createProfile: `${PARTICIPANT_DATA_API}/create-profile`,
        editProfile: `${PARTICIPANT_DATA_API}/edit-profile`,
    },
    COACH: {
        createProfileAndBranch: `${COACH_DATA_API}/create-branch`,
        editProfileAndBranch: `${COACH_DATA_API}/edit-branch`,
        createEvent: `${COACH_DATA_API}/create-event`,
        getCurrentBranches: `${COACH_DATA_API}/current-branches`,
        getCoachDetails: `${COACH_DATA_API}/get-by-detail`,
        getCoachList: `${API_V1_BASE}/get-coach-list`,
    },
    FACILITY: { getFacility: `${API_V1_BASE}/get-facility` },
    SALON: { getSalon: `${API_V1_BASE}/get-salon` },
    CLUB: { getClub: `${API_V1_BASE}/get-club` },
    CLUB_GROUPS: { getClubGroups: `${API_V1_BASE}/get-group` },
    EVENT_STYLE: { getEventStyle: `${API_V1_BASE}/get-event-style` },
    EVENTS: { getEvents: `${API_V1_BASE}/get-event` },
};
