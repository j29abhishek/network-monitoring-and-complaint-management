// ../components/BackButton.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (

    <div className="go-back-button">
     <FontAwesomeIcon
      icon={faArrowLeftLong}
      onClick={() => navigate(-1)}
      className="back-button"
    />
    </div>
   
  );
};

export default BackButton;
