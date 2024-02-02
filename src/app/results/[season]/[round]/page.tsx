'use client';

import { useAtom } from 'jotai';

import { Tabs } from '@/app/ui/Tabs';
import {
  constructorStandingsAtom,
  driverStandingsAtom,
  fetchStandings,
} from '@/atoms/standings';

// import { RaceSchedule } from '../../RaceResults';
import { StandingsTimeline } from '../../StandingsTimeline';
// import { handleRaceChangeAtom, seasonRacesAtom } from '@/atoms/races';

export default function ResultsPage({ params }: { params: { round: string } }) {
  useAtom(fetchStandings);
  const [constructorStandings] = useAtom(constructorStandingsAtom);
  const [driverStandings] = useAtom(driverStandingsAtom);

  // const [, handleRaceChange] = useAtom(handleRaceChangeAtom);
  // const [allRaces] = useAtom(seasonRacesAtom)

  if (!params) return <></>;
  // Get all

  // if (allRaces && allRaces.length > 0) {
  //   console.log('all races', allRaces[parseInt(params.round) - 1])

  //   handleRaceChange(allRaces[parseInt(params.round) - 1]);
  // }

  return (
    <main>
      <Tabs
        headers={['Drivers', 'Constructors']}
        containers={[
          <StandingsTimeline key='Driver Standings' data={driverStandings} />,
          <StandingsTimeline
            key='Constructor Standings'
            data={constructorStandings}
          />,
        ]}
      />
    </main>
  );
}
