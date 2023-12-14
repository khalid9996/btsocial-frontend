import PropTypes from "prop-types";

import "./reactions.scss";
// import { reactionsMap } from "../../../services/utils/static.data";

import { useRive } from "@rive-app/react-canvas";
import JOY from "../../../assets/rive/joy-rive.riv";
import LOVE from "../../../assets/rive/love-rive.riv";
import SAD from "../../../assets/rive/sad-rive.riv";
import LIKE from "../../../assets/rive/like-rive.riv";
import ANGRY from "../../../assets/rive/angry-rive.riv";
import WOW from "../../../assets/rive/wow-rive.riv";

const Reactions = ({ handleClick, showLabel = true }) => {
  // const reactionList = ["like", "love", "wow", "happy", "sad", "angry"];

  //////////
  const Like = useRive({
    src: `${LIKE}`,
    stateMachines: "controller",
    autoplay: true,
    onLoadError: () => console.log("Error Loading Rive"),
    onLoad: () => console.log("Rive Loaded"),
  });
  const Love = useRive({
    src: `${LOVE}`,
    stateMachines: "controller",
    autoplay: true,
    onLoadError: () => console.log("Error Loading Rive"),
    onLoad: () => console.log("Rive Loaded"),
  });
  const Wow = useRive({
    src: `${WOW}`,
    stateMachines: "controller",
    autoplay: true,
    onLoadError: () => console.log("Error Loading Rive"),
    onLoad: () => console.log("Rive Loaded"),
  });
  const Happy = useRive({
    src: `${JOY}`,
    stateMachines: "controller",
    autoplay: true,
    onLoadError: () => console.log("Error Loading Rive"),
    onLoad: () => console.log("Rive Loaded"),
  });

  const Sad = useRive({
    src: `${SAD}`,
    stateMachines: "controller",
    autoplay: true,
    onLoadError: () => console.log("Error Loading Rive"),
    onLoad: () => console.log("Rive Loaded"),
  });

  const Angry = useRive({
    src: `${ANGRY}`,
    stateMachines: "controller",
    autoplay: true,
    onLoadError: () => console.log("Error Loading Rive"),
    onLoad: () => console.log("Rive Loaded"),
  });

  const reactionItems = [
    { index: 1, name: "like" },
    { index: 2, name: "love" },
    { index: 3, name: "wow" },
    { index: 4, name: "happy" },
    { index: 5, name: "sad" },
    { index: 6, name: "angry" },
  ];
  const reactionsRiveIcons = {
    like: <Like.RiveComponent className="RiveJoy" />,
    love: <Love.RiveComponent className="RiveJoy" />,
    wow: <Wow.RiveComponent className="RiveJoy" />,
    happy: <Happy.RiveComponent className="RiveJoy" />,
    sad: <Sad.RiveComponent className="RiveJoy" />,
    angry: <Angry.RiveComponent className="RiveJoy" />,
  };

  return (
    <div className="reactions">
      <ul>
        {/* <li onClick={() => handleClick("like")}>
          <Like.RiveComponent className="RiveJoy" />
        </li>
        <li onClick={() => handleClick("love")}>
          <Love.RiveComponent className="RiveJoy" />
        </li>
        <li onClick={() => handleClick("wow")}>
          <Wow.RiveComponent className="RiveJoy" />
        </li>
        <li onClick={() => handleClick("happy")}>
          <Happy.RiveComponent className="RiveJoy" />
        </li>
        <li onClick={() => handleClick("sad")}>
          <Sad.RiveComponent className="RiveJoy" />
        </li>
        <li onClick={() => handleClick("angry")}>
          <Angry.RiveComponent className="RiveJoy" />
        </li> */}

        {reactionItems.map((data) => (
          <li key={data.index} onClick={() => handleClick(data.name)}>
            {showLabel && <label>{data.name}</label>}
            {reactionsRiveIcons[data.name]}
          </li>
        ))}

        {/* {reactionList.map((reaction, index) => (
          <li key={index} onClick={() => handleClick(reaction)}>
            {showLabel && <label>{reaction}</label>}
            <img src={reactionsMap[reaction]} alt="" />
          </li>
        ))} */}
      </ul>
    </div>
  );
};

Reactions.propTypes = {
  handleClick: PropTypes.func,
  showLabel: PropTypes.bool,
};

export default Reactions;
