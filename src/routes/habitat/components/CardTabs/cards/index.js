import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';

import Loader from 'Components/async/Loader';
import Can from 'Components/Authorize';
import Shortcuts from '../shortcuts';
import CardEditor from '../CardEditor';
// eslint-disable-next-line
import CreateCardButton from 'async!./components/CreateCardButton';

import SingleIconCard from './SingleIconCard';
import ThreeIconsCard from './ThreeIconsCard';
import FourIconsCard from './FourIconsCard';
import AnimalProfileCard from './AnimalProfileCard';
import ConservationCard from './ConservationCard';
import TwoVideosCard from './TwoVideosCard';
import SingleVideoCard from './SingleVideoCard';
import OriginAndHabitatCard from './OriginAndHabitatCard';
import AnimalBodyCard from './AnimalBodyCard';
import QuizCard from './QuizCard';

import { setCards } from '../actions';
import { fetchCards } from '../api';

import {
  ANIMAL_BODY_CARD_TYPE,
  ANIMAL_PROFILE_CARD_TYPE,
  CONSERVATION_CARD_TYPE,
  FOUR_ICONS_CARD_TYPE,
  ORIGIN_AND_HABITAT_CARD_TYPE,
  QUICK_LOOK,
  QUIZ_CARD_TYPE,
  SINGLE_ICON_CARD_TYPE,
  SINGLE_VIDEO_CARD_TYPE,
  THREE_ICONS_CARD_TYPE,
  TWO_VIDEOS_CARD_TYPE,
} from '../constants';

import style from './style.scss';

const Cards = ({
  cards = [],
  activeTab,
  shortcut,
  setCardsAction,
}) => {
  const [activeShortcut, setActiveShortcut] = useState(QUICK_LOOK);
  const [loading, setLoading] = useState(true);
  const { get } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { cards: newCards } = await fetchCards('mockHabitatID', activeTab);

        await Promise.all(newCards.map(async (card) => {
          // quiz cards have trivia question IDs in data which needs to be mapped
          // into questions, and we also need to map answers
          if (card.type === QUIZ_CARD_TYPE) {
            // eslint-disable-next-line no-underscore-dangle
            const cardData = await get(`cards/${card._id}/questions`);
            // eslint-disable-next-line no-param-reassign
            card.data = cardData;
          }
        }));

        setCardsAction(newCards);
      } catch (err) {
        // TODO: implement error UI
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTab, get, setCardsAction]);

  useEffect(() => {
    // TODO: guess we should scroll to the first cart that have tag === shortcut
  }, [shortcut]);

  const onShortcutClick = useCallback(({ target }) => {
    setActiveShortcut(target.dataset.value);
  }, [setActiveShortcut]);

  return (
    <>
      <div className={style.cards}>
        <div>
          {loading && (
            <Loader />
          )}

          {!loading && (
            cards.map((card) => (
              <CardEditor card={card}>
                {card.type === SINGLE_ICON_CARD_TYPE && (
                  <SingleIconCard
                    tag={card.tag}
                    title={card.data.title}
                    img={card.data.img}
                    text={card.data.text}
                  />
                )}

                {card.type === THREE_ICONS_CARD_TYPE && (
                  <ThreeIconsCard
                    tag={card.tag}
                    title={card.data.title}
                    img1={card.data.img1}
                    text1={card.data.text1}
                    img2={card.data.img2}
                    text2={card.data.text2}
                    img3={card.data.img3}
                    text3={card.data.text3}
                  />
                )}

                {card.type === FOUR_ICONS_CARD_TYPE && (
                  <FourIconsCard
                    tag={card.tag}
                    title={card.data.title}
                    text={card.data.text}
                    img1={card.data.img1}
                    icon1Txt={card.data.icon1Txt}
                    img2={card.data.img2}
                    icon2Txt={card.data.icon2Txt}
                    img3={card.data.img3}
                    icon3Txt={card.data.icon3Txt}
                    img4={card.data.img4}
                    icon4Txt={card.data.icon4Txt}
                  />
                )}

                {card.type === ANIMAL_PROFILE_CARD_TYPE && (
                  <AnimalProfileCard
                    tag={card.tag}
                    img={card.data.img}
                    name={card.data.name}
                    title={card.data.title}
                    sex={card.data.sex}
                    dateOfBirth={card.data.dateOfBirth}
                    text1={card.data.text1}
                    text2={card.data.text2}
                    text3={card.data.text3}
                  />
                )}

                {card.type === CONSERVATION_CARD_TYPE && (
                  <ConservationCard
                    tag={card.tag}
                    status={card.data.status}
                    title={card.data.title}
                    text={card.data.text}
                    btnLabel={card.data.btnLabel}
                    btnLink={card.data.btnLink}
                  />
                )}

                {card.type === TWO_VIDEOS_CARD_TYPE && (
                  <TwoVideosCard
                    tag={card.tag}
                    video1Url={card.data.video1Url}
                    video2Url={card.data.video2Url}
                    text1={card.data.text1}
                    text2={card.data.text2}
                  />
                )}

                {card.type === SINGLE_VIDEO_CARD_TYPE && (
                  <SingleVideoCard
                    tag={card.tag}
                    videoUrl={card.data.videoUrl}
                    title={card.data.title}
                    text={card.data.text}
                  />
                )}

                {card.type === ORIGIN_AND_HABITAT_CARD_TYPE && (
                  <OriginAndHabitatCard
                    tag={card.tag}
                    title={card.data.title}
                    img={card.data.img}
                    text={card.data.text}
                  />
                )}

                {card.type === ANIMAL_BODY_CARD_TYPE && (
                  <AnimalBodyCard
                    tag={card.tag}
                    img={card.data.img}
                    parts={card.data.parts}
                  />
                )}

                {card.type === QUIZ_CARD_TYPE && (
                  <QuizCard
                    // eslint-disable-next-line no-underscore-dangle
                    cardId={card._id}
                    questions={card.data.questions}
                    answers={card.data.answers}
                    correctAnswers={card.data.correctAnswers}
                  />
                )}
              </CardEditor>
            ))
          )}

          {/* this span is a hack for async-loader */}
          {/* seems like there's a bug, and async loader component can't find previous sibling */}
          <span />

          {!loading && (
            <Can
              perform="habitat:edit-cards"
              yes={() => (<CreateCardButton />)}
            />
          )}
        </div>
      </div>

      <Shortcuts active={activeShortcut} onClick={onShortcutClick} />
    </>
  );
};

export default connect(
  ({
    habitat: {
      cards: {
        items: cards,
        activeTab,
      },
    },
  }) => ({
    cards,
    activeTab,
  }),
  { setCardsAction: setCards },
)(Cards);