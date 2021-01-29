
  export interface attendee {
    fullName: string;
    role: string;
    hasJoinedVoice: boolean;
    isPresenter: boolean;
    isListeningOnly: boolean;
    hasVideo: boolean;
  }
  export interface meeting {
    isBreakout: boolean;
    breakoutRooms: { breakout: Array<string> };
    meetingID: string;
    recording: boolean;
    meetingName: string;
    participantCount: number;
    voiceParticipantCount: number;
    videoCount: number;
    attendees: { attendee: attendee | attendee[] }
  }