import profileImg from "../../src/images/me-profile.png";
import '../css/profile-image.css';

function ProfileImage()
{
  return (
    <div className="profile-image">
      <img src={profileImg} className="image" alt="profile"/>
    </div>
  )
}

export default ProfileImage