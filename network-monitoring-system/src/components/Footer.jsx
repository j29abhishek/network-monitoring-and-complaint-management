import React from 'react'
import niclogo2 from "../assets/nic-logo2.png"
import nknlogo from "../assets/nkn-logo.png"

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-logos">
        <img src={niclogo2} alt="National Informatics Center logo" />
        <img src={nknlogo} alt="National Knowledge Network logo" />
      </div>

      <div className="footer-description">
        <p>© {new Date().getFullYear()} <strong>Network Monitoring System</strong>. All rights reserved.</p>
        <p><strong>NIC - Network Division</strong>, Mahanadi Bhawan, Atal Nagar, Chhattisgarh, India</p>
        <p>Real-time monitoring, incident tracking, and performance assurance for critical infrastructure.</p>
        <p>Developed by <strong>Abhishek Jaiswal</strong> — Full Stack Developer | Intern @NIC (2025)</p>
      </div>
    </div>
  )
}

export default Footer
