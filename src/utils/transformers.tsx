export const formatConstructorResults = (drivers: DriverResult[]) =>
  drivers
    .reduce((cons, driver) => {
      // *** Find existint team from accumulator
      const existingTeamIndex = cons.findIndex(
        (team) => team.name === driver.TeamName,
      );

      // If:
      // 1. Team exists in accumulator
      // *** Update constructor values
      if (existingTeamIndex >= 0) {
        const update = { ...cons[existingTeamIndex] };
        const points = update.points + driver.Points;
        const conDrivers = [...update.drivers, driver];

        // *** Add Updated Constructor
        cons.push({
          ...update,
          points,
          drivers: conDrivers,
        });

        // *** Remove Old Constructor
        cons.splice(existingTeamIndex, 1);
      } else {
        // *** Add new Constructor
        cons.push({
          name: driver.TeamName,
          points: driver.Points,
          position: driver.Position, // Placeholder
          drivers: [driver],
        });
      }

      return cons;
    }, [] as ConstructorResult[])
    // Sort by points
    .sort((a, b) => (a.points > b.points ? -1 : 1))
    // Set proper position
    .map((con, i) => {
      con.position = i + 1;
      return con;
    });
