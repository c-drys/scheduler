export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

function getSpotsRemainingForDay(day, appointments) {
  console.log("**** callling real api");
  let spotsForThisDay = day.appointments;
  let freeSpots = 0;
  // go through each spot for this day
  for (const spot of spotsForThisDay) {
    // if that spot's appointment's interview is null:
    // that spot is free; increment freeSpots
    if (appointments[spot].interview === null) {
      freeSpots++;
    }
  }
  return freeSpots;
}
function decorateDaysWithSpots(days, appointments) {
  const decoratedDays = days.map(day => ({
    ...day,
    spots: getSpotsRemainingForDay(day, appointments)
  }));
  return decoratedDays;
}

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY: {
      return {
        ...state,
        day: action.day
        // spots: action.decorateDaysWithSpots
      };
    }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case SET_INTERVIEW: {
      const appointments = {
        ...state.appointments,
        [action.id]: {
          ...state.appointments[action.id],
          interview: action.interview === null ? null : { ...action.interview }
        }
      };
      const days = decorateDaysWithSpots(state.days, appointments);
      return {
        ...state,
        days,
        appointments
      };
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    // return state;
  }
}