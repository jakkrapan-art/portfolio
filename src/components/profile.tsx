import '../css/profile.css';
import githubImg from "../images/github.png"
import linkedinImg from "../images/linkedin.png"

function Profile()
{
  const timeDiff = (Date.now() - new Date("2022-06-12").getTime())/1000;

  function getWorkExp()
  {
    const day = timeDiff / (60 * 60 * 24);
    const year = Math.floor(day / (365.25));
    const month = Math.floor(day % (365.25) / 30);

    return <>{year} year{year !== 1 ? "s" : ""} {month} month{month !== 1 ? "s" : ""}</>;
  }

  const handleDownload = async () => {
    const pdfUrl = './files/resume.pdf';

    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }

      console.log("pdf:", response);
      const blob = await response.blob();

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'jakkrapan-resume.pdf';

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return <div className="profile">
    <p className="profile-main">Jakkrapan Thongphet</p>
    <p className="profile-sub">Game Developer ({getWorkExp()})</p>

    <div className="actions-container">
      <div>
        <ul className="actions-content">
          <li className="action-item"><button className="medium main-color"  onClick={handleDownload}>Download Resume</button></li>
        </ul>
      </div>
    </div>
  </div>
}

export default Profile