import { useEffect, useRef, useState } from 'react';
import '../css/navbar.css';
import githubImg from "../images/github.png";
import linkedinImg from "../images/linkedin.png";
import ContactModal from './contact-modal';

function NavBar() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNavbarShowing, setNavbarShowing] = useState(true);
  const navbarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function updateShowNavBar()
    {
      if(buttonRef.current)
      {
        const buttonStyle = window.getComputedStyle(buttonRef.current);
        const buttonDisplay = buttonStyle.getPropertyValue('display');
        if (buttonDisplay === 'none' && !isNavbarShowing) {
          setNavbarShowing(true);
        }
      }
    }
    updateShowNavBar();
    window.addEventListener('resize', updateShowNavBar);
  }, [isNavbarShowing]);


  function toggleNavbar() {
    setNavbarShowing(!isNavbarShowing);
  }

  function openContactModal() {
    setIsContactModalOpen(true);
  }

  function closeContactModal() {
    setIsContactModalOpen(false);
  }

  return (
    <div className={`navbar ${isNavbarShowing ? '' : 'hidden'}`} ref={navbarRef}>
      {(isNavbarShowing) && (
        <div className="navbar-content">
          <ul className="navbar-list">
            <li className="nav-item"><span className='clickable' onClick={openContactModal}>Contact Me</span></li>
            <li className="nav-item"><a href='https://github.com/jakkrapan-art' target='_blank' rel='noreferrer'><img src={githubImg} className="button-icon" alt="github" /></a></li>
            <li className="nav-item"><a href='https://www.linkedin.com/in/jakkrapan-thongphet-a81b30247/' target='_blank' rel='noreferrer'><img src={linkedinImg} className="button-icon" alt="linkedin" /></a></li>
          </ul>
        </div>
      )}
      <div className="nav-item">
        <input type="button" className='toggle-btn' value={isNavbarShowing ? "Hide Menu" : "Show Menu"} onClick={toggleNavbar} ref={buttonRef}/>
      </div>
      {isContactModalOpen && <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />}
    </div>
  );
}

export default NavBar;
