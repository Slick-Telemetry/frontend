import { atom, useAtom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

import {
  formatRaceEventName,
  formatRaceUrl,
  formatSessionName,
  formatSessionUrl,
} from '@/utils/transformers';

import { allDriversAtom, driverAtom } from './drivers';
import { raceAtom, seasonRacesAtom } from './races';
import { seasonAtom } from './seasons';
import { allSessionsAtom, sessionAtom } from './sessions';

// Server Error Atom
export const serverErrorAtom = atom('');

// Telemetry Active
export const telemetryDisableAtom = atom(true);
// Telemetry is disabled if no race and driver are selected
export const toggleTelemetryDisableAtom = atomEffect((get, set) => {
  set(
    telemetryDisableAtom,
    get(raceAtom) === 'All Races' || get(driverAtom) === 'All Drivers',
  );
});

export const handleMainFilterSubmit = atom(null, (get) => {
  const season = get(seasonAtom);
  const race = get(raceAtom);
  const driver = get(driverAtom);
  const session = get(sessionAtom);
  const sessions = get(allSessionsAtom);
  const url = [];

  // Return if no race specified
  if (!season) return;
  // Add season to url
  else url.push(season);

  // Return if no race specified
  if (race === 'All Races') return url.join('/');
  // Add race location to url
  else url.push(formatRaceUrl(race.EventName));

  // Return if no driver specified
  if (driver === 'All Drivers') return url.join('/');
  // Add driver id to url
  else url.push(driver.DriverId);

  // Return if no sessions
  if ((sessions && sessions.length === 0) || session === 'Race')
    return url.join('/');
  // Add session to url
  else url.push(formatSessionUrl(session));

  return url.join('/');
});

export const useParamToSetAtoms = () => {
  const [season, eventParam, driverId, sessionParam] = usePathname()
    .split('/')
    .slice(1);

  const [seasonVal, setSeason] = useAtom(seasonAtom);
  const [races] = useAtom(seasonRacesAtom);
  const [race, setRace] = useAtom(raceAtom);
  const [drivers] = useAtom(allDriversAtom);
  const [driver, setDriver] = useAtom(driverAtom);
  const [sessions] = useAtom(allSessionsAtom);
  const [, setSession] = useAtom(sessionAtom);

  // Loading Refs
  const seasonLoaded = useRef(false);
  const raceLoaded = useRef(false);
  const driverLoaded = useRef(false);
  const sessionLoaded = useRef(false);

  if (!seasonLoaded.current) {
    if (season && season !== seasonVal) setSeason(season);
    seasonLoaded.current = true;
  }

  if (!raceLoaded.current) {
    // If no location nothing to load/check
    if (!eventParam) {
      raceLoaded.current = true;
      return;
    }
    // if location and races to compare to
    if (races) {
      raceLoaded.current = true;
      const eventName = formatRaceEventName(eventParam);
      const raceMatch = races.find((r) => r.EventName === eventName);
      if (race === 'All Races' || raceMatch?.EventName !== race?.EventName) {
        setRace(raceMatch || 'All Races');
      }
    }
  }

  if (!driverLoaded.current) {
    // If no driverId nothing to load/check
    if (!driverId) {
      driverLoaded.current = true;
      return;
    }

    // if drivers to compare to driverId
    if (drivers) {
      if (eventParam && drivers.length === 0) return;

      driverLoaded.current = true;
      const driverMatch = drivers.find((d) => d.DriverId === driverId);

      if (driver === 'All Drivers' || driverMatch?.DriverId !== driver.DriverId)
        setDriver(driverMatch || 'All Drivers');
    }
  }

  if (!sessionLoaded.current) {
    // If no driverId nothing to load/check
    if (!sessionParam) {
      sessionLoaded.current = true;
      return;
    }

    // if driver and driver to compare to
    if (sessions) {
      sessionLoaded.current = true;
      const session = formatSessionName(sessionParam);
      setSession(sessions.find((s) => s === session) || 'Race');
    }
  }
};
