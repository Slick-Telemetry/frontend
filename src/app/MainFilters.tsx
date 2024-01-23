'use client';

import { useAtom } from 'jotai/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Dropdown } from './ui/Dropdown';
import {
  allSeasonsAtom,
  driverAtom,
  driversAtom,
  fetchDriver,
  fetchRaces,
  fetchSeasons,
  fetchSessions,
  handleDriverChangeAtom,
  handleRaceChangeAtom,
  handleResultsAtom,
  handleSeasonChangeAtom,
  handleSessionChangeAtom,
  raceAtom,
  resultUrlAtom,
  seasonAtom,
  seasonRacesAtom,
  sessionAtom,
  sessionsAtom,
  telemetryDisableAtom,
  toggleTelemetryDisableAtom,
} from '../atoms/results';

type actionT = {
  action: (url: string) => void;
};

const SeasonDropdown = ({ action }: actionT) => {
  const [season] = useAtom(seasonAtom);
  const [, handleSeasonChange] = useAtom(handleSeasonChangeAtom);
  const [seasons] = useAtom(allSeasonsAtom);

  const handleAction = (val: string) => {
    handleSeasonChange(val).then((url: string) => {
      action(url);
    });
  };

  useAtom(fetchSeasons);
  return <Dropdown value={season} items={seasons} action={handleAction} />;
};

const RaceDropdown = ({ action }: actionT) => {
  const [race] = useAtom(raceAtom);
  const [, handleRaceChange] = useAtom(handleRaceChangeAtom);
  const [races] = useAtom(seasonRacesAtom);

  const handleAction = (val: string) => {
    const match = races.find((race) => race.EventName === val);
    if (match) {
      handleRaceChange(match).then((url: string) => {
        action(url);
      });
    }
  };

  useAtom(fetchRaces);

  return (
    <Dropdown
      value={typeof race === 'string' ? race : race.EventName}
      items={races.map((race) => race.EventName)}
      action={handleAction}
    />
  );
};

const DriverDropdown = ({ action }: actionT) => {
  const [driverName] = useAtom(driverAtom);
  const [, handleDriverChange] = useAtom(handleDriverChangeAtom);
  const [driverList] = useAtom(driversAtom);

  const handleAction = (val: string) => {
    handleDriverChange(val).then((url: string) => {
      action(url);
    });
  };

  useAtom(fetchDriver);
  return (
    <Dropdown value={driverName} items={driverList} action={handleAction} />
  );
};
const SessionDropdown = ({ action }: actionT) => {
  const [sessionName] = useAtom(sessionAtom);
  const [, handleSessionChange] = useAtom(handleSessionChangeAtom);
  const [sessionList] = useAtom(sessionsAtom);

  const handleAction = (val: string) => {
    handleSessionChange(val).then((url: string) => {
      action(url);
    });
  };

  useAtom(fetchSessions);
  return (
    <Dropdown value={sessionName} items={sessionList} action={handleAction} />
  );
};
export const MainFilters = () => {
  const router = useRouter();

  useAtom(toggleTelemetryDisableAtom);
  const [telemetryDisable] = useAtom(telemetryDisableAtom);
  const [resultsUrl] = useAtom(resultUrlAtom);
  const [, handleResultsClick] = useAtom(handleResultsAtom);
  useAtom(fetchSeasons);

  const changePath = (url: string) => {
    router.push(url);
  };

  return (
    <div className='flex flex-col gap-2'>
      {/* <Dropdown value={} /> */}
      <div className='flex lg:gap-4'>
        <SeasonDropdown action={changePath} />
        <RaceDropdown action={changePath} />
      </div>

      <div className='flex items-center lg:gap-4'>
        <DriverDropdown action={changePath} />
        in
        <SessionDropdown action={changePath} />
      </div>

      <div className='flex gap-4'>
        <button className='btn btn-primary btn-sm'>
          <Link href={resultsUrl} onClick={() => handleResultsClick()}>
            Results
          </Link>
        </button>
        <button disabled={telemetryDisable} className='btn btn-sm'>
          Telemetry
        </button>
      </div>
    </div>
  );
};