import moment from 'moment';

const formatLeaguesForItems = leagues => {
  return leagues.map(league => {
    return {
      id: league.id,
      type: 'league',
      name: league.league_abbreviation,
      fullName: league.league_name,
      logo: league.league_logo,
      rating: league.rating || 0,
      ratingCount: league.rating_count || 0,
      hasConferences: league.league_name.includes('NCAA')
    };
  });
};

const formatConferencesForItems = conferences => {
  return conferences.map(conference => {
    return {
      id: conference.id,
      type: 'conference',
      name: conference.conference_abbreviation,
      fullName: conference.conference_name,
      logo: conference.conference_logo,
      league: conference.league_abbreviation,
      rating: conference.rating || 0,
      ratingCount: conference.rating_count || 0
    };
  });
};

const formatTeamsForItems = response => {
  return response.map(item => {
    return {
      id: item.id,
      type: 'team',
      name: item.team_name,
      logo: item.team_logo,
      league: item.league_abbreviation,
      rating: item.rating || 0,
      ratingCount: item.rating_count || 0
    };
  });
};

const formatItemSearchResults = response => {
  const results = [];
  const formattedLeagues = formatLeaguesForItems(response.leagues);
  const formattedConferences = formatConferencesForItems(response.conferences);
  const formattedTeams = formatTeamsForItems(response.teams);

  results.push(...formattedLeagues);
  results.push(...formattedConferences);
  results.push(...formattedTeams);
  return results;
};

const formatAdditionalForItems = response => {
  const { favoriteLeagues = [], favoriteTeams = [], favoriteConferences = [] } = response;
  const leagues = favoriteLeagues.map(league => {
    return {
      id: league.id,
      type: 'league',
      name: league.league_abbreviation,
      fullName: league.league_name,
      logo: league.league_logo,
      rating: league.rating || 0,
      ratingCount: league.rating_count || 0
    };
  });
  const teams = favoriteTeams.map(item => {
    return {
      id: item.id,
      type: 'team',
      name: item.team_name,
      logo: item.team_logo,
      league: item.league_abbreviation,
      rating: item.rating || 0,
      ratingCount: item.rating_count || 0
    };
  });
  const conferences = favoriteConferences.map(item => {
    return {
      id: item.id,
      type: 'conference',
      name: item.conference_name,
      logo: item.conference_logo,
      league: item.league_abbreviation,
      rating: item.rating || 0,
      ratingCount: item.rating_count || 0
    };
  });

  return {
    leagues,
    teams,
    conferences
  };
};

const formatLeaguesForTabs = (leagues, withAll) => {
  const result = leagues.map(league => {
    return {
      id: league.id,
      title: league.league_abbreviation,
      key: league.league_abbreviation,
      logo: league.league_logo
    };
  });
  if (withAll) {
    // Add All to the front.
    result.unshift({
      id: 'all',
      title: 'All',
      key: 'All',
      logo: ''
    });
  } else {
    // Add Top Events to the front.
    result.unshift({
      id: 'top',
      title: 'Top Events',
      key: 'Top Events',
      logo: ''
    });
  }
  return result;
};

const formatSportsForTabs = sports => {
  const result = sports.map(sport => {
    return {
      id: sport.id,
      title: sport.sport_name,
      key: sport.sport_name,
      logo: sport.sport_logo
    };
  });
  // Add All to the front.
  result.unshift({
    id: 'all',
    title: 'All',
    key: 'All',
    logo: ''
  });
  return result;
};

const formatGamesForSectionList = (trendingGames, upcomingGames) => {
  const data = [
    {
      title: 'TRENDING GAMES',
      data: trendingGames
    }
  ];

  const pastGames = upcomingGames.filter(game => {
    // Past Games have hours > 0
    const hours = moment().diff(moment(game.start_time), 'hours');
    return hours >= 4;
  });

  const liveGames = upcomingGames.filter(game => {
    // Within -1 hours for pregame discussion, 4 hours for duration of most game's discussion. After 4 its a past game.
    const hours = moment().diff(moment(game.start_time), 'hours');
    return hours > -1 && hours < 4;
  });

  const upcoming = upcomingGames.filter(game => {
    // Future returns hours < 0 - -1 is the cutoff for live game
    const hours = moment().diff(moment(game.start_time), 'hours');
    return hours <= -1;
  });

  if (liveGames.length > 0) {
    data[data.length] = {
      title: 'LIVE GAMES',
      data: liveGames
    };
  }

  if (pastGames.length > 0) {
    data[data.length] = {
      title: 'PAST GAMES',
      data: pastGames
    };
  }

  if (upcoming.length > 0) {
    data[data.length] = {
      title: 'UPCOMING GAMES',
      data: upcoming
    };
  }

  return data;
};

const sortByRatings = items => {
  return items.sort((a, b) => {
    // If ratings are null - push to the back
    if (a.rating === null) {
      console.log('Rating is null - a', a, b);
      return 1;
    }
    if (b.rating === null) {
      console.log('Rating is null - b', a, b);
      return -1;
    }
    // TieBreaker if Ratings are the same. Highest rating count first.
    if (Number(a.rating) - Number(b.rating) === 0) {
      console.log('Same Rating', a, b);
      return Number(b.ratingCount) - Number(a.ratingCount);
    }
    // Sort by Rating Desc Highest - Lowest
    return Number(b.rating) - Number(a.rating);
  });
};

export default {
  formatLeaguesForItems,
  formatTeamsForItems,
  formatAdditionalForItems,
  formatLeaguesForTabs,
  formatSportsForTabs,
  formatConferencesForItems,
  formatItemSearchResults,
  formatGamesForSectionList,
  sortByRatings
};
