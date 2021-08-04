import { connect } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'preact/hooks';
import classnames from 'classnames';

import RoundButton from 'Components/RoundButton';
import TrimVideoModal from './TrimVideoModal';
import { setClipButtonClicked } from '../../../../../redux/actions'

import style from './style.scss';

const RecordVideoButton = ({ isClicked, setClipButtonClickedAction }) => {
  const [showModal, setShowModal] = useState(false);

  const onClickHandler = () => {
    setShowModal(true);
    setClipButtonClickedAction(true);
  };

  return (
    <>
      <div>
        <RoundButton
          onClick={onClickHandler}
          width="36"
          backgroundColor="var(--blueDark)"
          color="white"
          className={classnames(style.button, { [style.animate]: !isClicked })}
        >
          <FontAwesomeIcon icon={faVideo} />
        </RoundButton>
      </div>
      {showModal && <TrimVideoModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default connect(({
  user: { clipButtonClicked: isClicked },
}) => ({ isClicked }), {
  setClipButtonClickedAction: setClipButtonClicked,
})(RecordVideoButton);
