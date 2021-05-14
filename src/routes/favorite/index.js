import { h } from 'preact';
import { useCallback, useEffect, useReducer } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';
import { connect } from 'react-redux';

import { buildURL } from 'Shared/fetch';
import HabitatCard from 'Components/HabitatCard';
import Loader from 'Components/async/Loader';
import NoContentFallback from 'Components/NoContentFallback';

import { useIsInitiallyLoaded, useWindowResize } from '../../hooks';
import { updateFavoriteHabitat } from '../../redux/actions';

const SET_DATA = 'SET_DATA';
const REMOVE_HABITAT = 'REMOVE_HABITAT';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case SET_DATA: {
      return { ...state, ...payload };
    }

    case REMOVE_HABITAT: {
      const { habitatId } = payload;
      return {
        ...state,
        habitats: state.habitats.filter(({ _id }) => _id !== habitatId),
      };
    }

    default: {
      return state;
    }
  }
};

const url = buildURL('/habitats/favorite');

const Favorite = ({ updateFavoriteHabitatAction }) => {
  const { width } = useWindowResize();
  const [{ habitats = [] }, dispatch] = useReducer(reducer, {});
  const { loading, error, get } = useFetch(url, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });
  // using different useFetch hook because we need to handle error differently
  const { del, response: delResponse } = useFetch(url, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });
  const loaded = useIsInitiallyLoaded(loading);

  useEffect(() => {
    const loadHabitats = async () => {
      const { habitats } = await get();
      dispatch({ type: SET_DATA, payload: { habitats } });
    };

    loadHabitats();
  }, [get]);

  const onFavoriteClick = useCallback(async (habitatId) => {
    await del({ habitatId });
    if (delResponse.ok) {
      dispatch({ type: REMOVE_HABITAT, payload: { habitatId } });
      updateFavoriteHabitatAction(habitatId);
    } else {
      // TODO: display error
      // maybe display a toast
      console.warn(delResponse.data?.error ?? 'There was an error');
    }
  }, [del, delResponse, updateFavoriteHabitatAction]);

  return (
    <Box flex overflow="auto">
      <Box
        direction="row"
        align="center"
        height={{ min: '80px' }}
        pad={{ horizontal: 'large', vertical: 'medium' }}
      >
        <Box justify="start" height="26px">
          <Heading
            margin={{ top: '0', bottom: '0', right: '20px' }}
            color="var(--charcoal)"
            level="3"
            style={{ lineHeight: '.8em' }}
          >
            My Favorites
          </Heading>
        </Box>
        <Box justify="center" height="28px">
          <Text margin="0" size="xlarge" color="var(--charcoalLight)" style={{ lineHeight: '.8em' }}>
            Your top habitats in one glance! Tap the heart to remove a favorite.
          </Text>
        </Box>
      </Box>

      <Box
        wrap
        pad={{ horizontal: 'large', vertical: 'medium' }}
        background="var(--hunterGreenMediumLight)"
        flex="grow"
        direction="row"
        justify={width < 850 ? 'center' : 'start' }
      >
        {!loaded && <Loader fill color="white" />}

        {error && (
          <Box fill justify="center" align="center">
            <Heading level="4" color="#fff">
              There was an error. Please try again.
            </Heading>
          </Box>
        )}

        {loaded && habitats.map(({
          _id,
          slug,
          online,
          liveTalk,
          title,
          zoo,
          description,
          wideImage: image,
        }) => (
          <Box key={_id} pad="small" flex="shrink">
            <HabitatCard
              favorite
              slug={slug}
              zooSlug={zoo?.slug}
              habitatId={_id}
              online={online}
              liveTalk={liveTalk}
              title={title}
              description={description}
              image={image}
              logo={zoo?.logo}
              onFavoriteClick={onFavoriteClick}
            />
          </Box>
        ))}

        {loaded && !error && habitats.length === 0 && (
          <Box fill flex="grow" justify="center">
            <NoContentFallback
              text="Add your favorite animal habitats here for easy access."
              subText="Favorite by tapping the heart on the photo icon in any habitat. "
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default connect(null, { updateFavoriteHabitatAction: updateFavoriteHabitat })(Favorite);
