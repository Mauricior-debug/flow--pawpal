import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { DistanceUnit, WeightUnit } from './format';

export type Meal = { id: string; time: string; food: string; fed: boolean };
export type Visit = { id: string; title: string; date: string };
export type Vaccine = { id: string; title: string; date: string };
export type Weight = { id: string; label: string; lbs: number };
export type Moment = { id: string; note: string; uri?: string };
export type Trick = { id: string; name: string; progress: number; done: boolean };

export type WalkStatus = 'idle' | 'active' | 'paused';

export type Walk = {
  status: WalkStatus;
  elapsedSec: number;
  distanceKm: number;
  moments: Moment[];
};

type Dog = { name: string; breed: string; ageYears: number };

export type State = {
  sample: boolean;
  dog: Dog;
  units: DistanceUnit;
  weightUnit: WeightUnit;
  notifications: { meals: boolean; walks: boolean; training: boolean };
  dailyKm: number;
  goalKm: number;
  streakDays: number;
  tricksMastered: number;
  reminder: { title: string; body: string } | null;
  meals: Meal[];
  visits: Visit[];
  vaccines: Vaccine[];
  weights: Weight[];
  walk: Walk;
  lastWalk: { seconds: number; km: number } | null;
  lesson: {
    title: string;
    day: number;
    progress: number;
    completed: boolean;
    nextLessonAt: number | null;
  };
  tricks: Trick[];
  practicedDays: number[];
  selectedDay: number;
};

const WALK_RATE = 1.5 / (25 * 60 + 32);

let seq = 1;
export function uid(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}`;
}

function seed(): State {
  const nextLessonAt = Date.now() + (12 * 60 + 45) * 60 * 1000;
  return {
    sample: true,
    dog: { name: 'Buddy', breed: 'Corgi', ageYears: 3 },
    units: 'km',
    weightUnit: 'lbs',
    notifications: { meals: true, walks: true, training: true },
    dailyKm: 5.2,
    goalKm: 8,
    streakDays: 7,
    tricksMastered: 34,
    reminder: {
      title: "Biscuit's annual check-up",
      body: 'is due in 14 days.',
    },
    meals: [
      { id: 'meal-breakfast', time: '8:00 AM', food: 'Royal Canin Puppy', fed: true },
      { id: 'meal-lunch', time: '12:30 PM', food: 'Royal Canin Puppy', fed: false },
      { id: 'meal-dinner', time: '6:00 PM', food: 'Royal Canin Puppy', fed: false },
    ],
    visits: [
      { id: 'visit-yearly', title: 'Yearly Check-up', date: 'Nov 15, 2023' },
      { id: 'visit-dental', title: 'Dental Cleaning', date: 'Feb 01, 2024' },
    ],
    vaccines: [
      { id: 'vax-disbies', title: 'Disbies', date: 'Nov 15, 2024' },
      { id: 'vax-bordetetr', title: 'Bordetetr', date: 'May 20, 2024' },
    ],
    weights: [
      { id: 'w-jan', label: 'Jan', lbs: 28.5 },
      { id: 'w-apr', label: 'Apr', lbs: 29.1 },
      { id: 'w-jul', label: 'Jul', lbs: 29.0 },
      { id: 'w-oct', label: 'Oct', lbs: 29.5 },
    ],
    walk: { status: 'active', elapsedSec: 25 * 60 + 32, distanceKm: 1.5, moments: [] },
    lastWalk: null,
    lesson: {
      title: 'Sit & Stay',
      day: 3,
      progress: 0.55,
      completed: false,
      nextLessonAt,
    },
    tricks: [
      { id: 'paw', name: 'Paw', progress: 1, done: true },
      { id: 'highfive', name: 'High Five', progress: 0.45, done: false },
    ],
    practicedDays: [5, 13, 20, 29, 30],
    selectedDay: 13,
  };
}

function fresh(): State {
  return {
    sample: false,
    dog: { name: 'Buddy', breed: 'Corgi', ageYears: 0 },
    units: 'km',
    weightUnit: 'lbs',
    notifications: { meals: true, walks: true, training: true },
    dailyKm: 0,
    goalKm: 8,
    streakDays: 0,
    tricksMastered: 0,
    reminder: null,
    meals: [],
    visits: [],
    vaccines: [],
    weights: [],
    walk: { status: 'idle', elapsedSec: 0, distanceKm: 0, moments: [] },
    lastWalk: null,
    lesson: {
      title: 'Sit & Stay',
      day: 1,
      progress: 0,
      completed: false,
      nextLessonAt: null,
    },
    tricks: [
      { id: 'paw', name: 'Paw', progress: 0, done: false },
      { id: 'highfive', name: 'High Five', progress: 0, done: false },
    ],
    practicedDays: [],
    selectedDay: new Date().getDate(),
  };
}

type Action =
  | { type: 'tick' }
  | { type: 'startWalk' }
  | { type: 'pauseWalk' }
  | { type: 'resumeWalk' }
  | { type: 'stopWalk' }
  | { type: 'addMoment'; note: string; uri?: string }
  | { type: 'markMealFed'; id: string }
  | { type: 'addMeal'; time: string; food: string }
  | { type: 'addVisit'; title: string; date: string }
  | { type: 'addVaccine'; title: string; date: string }
  | { type: 'addWeight'; label: string; lbs: number }
  | { type: 'removeRecord'; kind: 'visit' | 'vaccine'; id: string }
  | { type: 'updateDog'; dog: Dog }
  | { type: 'setUnits'; units: DistanceUnit }
  | { type: 'setWeightUnit'; weightUnit: WeightUnit }
  | { type: 'setNotifications'; notifications: State['notifications'] }
  | { type: 'selectDay'; day: number }
  | { type: 'practiceTrick'; id: string }
  | { type: 'finishLesson' }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'tick': {
      if (state.walk.status !== 'active') return state;
      return {
        ...state,
        dailyKm: state.dailyKm + WALK_RATE,
        walk: {
          ...state.walk,
          elapsedSec: state.walk.elapsedSec + 1,
          distanceKm: state.walk.distanceKm + WALK_RATE,
        },
      };
    }
    case 'startWalk': {
      if (state.walk.status === 'paused') {
        return { ...state, walk: { ...state.walk, status: 'active' } };
      }
      if (state.walk.status === 'active') return state;
      return {
        ...state,
        walk: { status: 'active', elapsedSec: 0, distanceKm: 0, moments: [] },
      };
    }
    case 'pauseWalk':
      if (state.walk.status !== 'active') return state;
      return { ...state, walk: { ...state.walk, status: 'paused' } };
    case 'resumeWalk':
      if (state.walk.status !== 'paused') return state;
      return { ...state, walk: { ...state.walk, status: 'active' } };
    case 'stopWalk': {
      if (state.walk.status === 'idle') return state;
      return {
        ...state,
        lastWalk: { seconds: state.walk.elapsedSec, km: state.walk.distanceKm },
        walk: { status: 'idle', elapsedSec: 0, distanceKm: 0, moments: [] },
      };
    }
    case 'addMoment':
      if (state.walk.status === 'idle') return state;
      return {
        ...state,
        walk: {
          ...state.walk,
          moments: [
            ...state.walk.moments,
            { id: uid('moment'), note: action.note, uri: action.uri },
          ],
        },
      };
    case 'markMealFed':
      return {
        ...state,
        meals: state.meals.map((meal) => (meal.id === action.id ? { ...meal, fed: true } : meal)),
      };
    case 'addMeal':
      return {
        ...state,
        meals: [...state.meals, { id: uid('meal'), time: action.time, food: action.food, fed: false }],
      };
    case 'addVisit':
      return {
        ...state,
        visits: [...state.visits, { id: uid('visit'), title: action.title, date: action.date }],
      };
    case 'addVaccine':
      return {
        ...state,
        vaccines: [...state.vaccines, { id: uid('vax'), title: action.title, date: action.date }],
      };
    case 'addWeight':
      return {
        ...state,
        weights: [...state.weights, { id: uid('weight'), label: action.label, lbs: action.lbs }],
      };
    case 'removeRecord':
      if (action.kind === 'visit') {
        return { ...state, visits: state.visits.filter((item) => item.id !== action.id) };
      }
      return { ...state, vaccines: state.vaccines.filter((item) => item.id !== action.id) };
    case 'updateDog':
      return { ...state, dog: action.dog };
    case 'setUnits':
      return { ...state, units: action.units };
    case 'setWeightUnit':
      return { ...state, weightUnit: action.weightUnit };
    case 'setNotifications':
      return { ...state, notifications: action.notifications };
    case 'selectDay':
      return { ...state, selectedDay: action.day };
    case 'practiceTrick': {
      let mastered = state.tricksMastered;
      const tricks = state.tricks.map((trick) => {
        if (trick.id !== action.id || trick.done) return trick;
        const progress = Math.min(1, trick.progress + 0.2);
        const done = progress >= 1;
        if (done) mastered += 1;
        return { ...trick, progress, done };
      });
      return { ...state, tricks, tricksMastered: mastered };
    }
    case 'finishLesson': {
      if (state.lesson.completed) return state;
      const today = new Date().getDate();
      const practiced = state.practicedDays.includes(today)
        ? state.practicedDays
        : [...state.practicedDays, today];
      return {
        ...state,
        tricksMastered: state.tricksMastered + 1,
        streakDays: Math.max(state.streakDays, 1),
        practicedDays: practiced,
        lesson: {
          ...state.lesson,
          progress: 1,
          completed: true,
          nextLessonAt: Date.now() + (12 * 60 + 45) * 60 * 1000,
        },
      };
    }
    case 'reset':
      return fresh();
    default:
      return state;
  }
}

type Store = State & {
  nextMeal: Meal | null;
  startWalk: () => void;
  pauseWalk: () => void;
  resumeWalk: () => void;
  stopWalk: () => { seconds: number; km: number } | null;
  addMoment: (note: string, uri?: string) => void;
  markMealFed: (id: string) => void;
  addMeal: (time: string, food: string) => void;
  addVisit: (title: string, date: string) => void;
  addVaccine: (title: string, date: string) => void;
  addWeight: (label: string, lbs: number) => void;
  removeRecord: (kind: 'visit' | 'vaccine', id: string) => void;
  updateDog: (dog: Dog) => void;
  setUnits: (units: DistanceUnit) => void;
  setWeightUnit: (weightUnit: WeightUnit) => void;
  setNotifications: (notifications: State['notifications']) => void;
  selectDay: (day: number) => void;
  practiceTrick: (id: string) => boolean;
  finishLesson: () => void;
  reset: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seed);

  useEffect(() => {
    if (state.walk.status !== 'active') return undefined;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [state.walk.status]);

  const value = useMemo<Store>(() => {
    const nextMeal = state.meals.find((meal) => !meal.fed) ?? null;
    return {
      ...state,
      nextMeal,
      startWalk: () => dispatch({ type: 'startWalk' }),
      pauseWalk: () => dispatch({ type: 'pauseWalk' }),
      resumeWalk: () => dispatch({ type: 'resumeWalk' }),
      stopWalk: () => {
        if (state.walk.status === 'idle') return null;
        const summary = { seconds: state.walk.elapsedSec, km: state.walk.distanceKm };
        dispatch({ type: 'stopWalk' });
        return summary;
      },
      addMoment: (note, uri) => dispatch({ type: 'addMoment', note, uri }),
      markMealFed: (id) => dispatch({ type: 'markMealFed', id }),
      addMeal: (time, food) => dispatch({ type: 'addMeal', time, food }),
      addVisit: (title, date) => dispatch({ type: 'addVisit', title, date }),
      addVaccine: (title, date) => dispatch({ type: 'addVaccine', title, date }),
      addWeight: (label, lbs) => dispatch({ type: 'addWeight', label, lbs }),
      removeRecord: (kind, id) => dispatch({ type: 'removeRecord', kind, id }),
      updateDog: (dog) => dispatch({ type: 'updateDog', dog }),
      setUnits: (units) => dispatch({ type: 'setUnits', units }),
      setWeightUnit: (weightUnit) => dispatch({ type: 'setWeightUnit', weightUnit }),
      setNotifications: (notifications) => dispatch({ type: 'setNotifications', notifications }),
      selectDay: (day) => dispatch({ type: 'selectDay', day }),
      practiceTrick: (id) => {
        const trick = state.tricks.find((item) => item.id === id);
        const willMaster = !!trick && !trick.done && trick.progress + 0.2 >= 1;
        dispatch({ type: 'practiceTrick', id });
        return willMaster;
      },
      finishLesson: () => dispatch({ type: 'finishLesson' }),
      reset: () => dispatch({ type: 'reset' }),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('Store missing');
  return value;
}
