import NavBar from "../components/navbar";
import Profile from "../components/profile";
import ProfileImage from "../components/profile-image";
import ProjectShowcase from "../components/project-showcase";

import WorkExperience from "../components/work-exp";

export function Home()
{
  return (
    <div className="home">
      <NavBar/>
      <ProfileImage/>
      <Profile/>
      <WorkExperience/>
      <ProjectShowcase/>
    </div>
  )
}