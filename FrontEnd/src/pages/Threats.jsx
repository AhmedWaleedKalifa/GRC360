import React from 'react'
import CardSlider from '../components/CardSlider'
function Threats() {
  return (
    <CardSlider
      caption={{ text: "Live Threat Feed", icon: "faCircleExclamation" }}
      titles={["description", "severity", "date", "time"]}
      sizes={[4,1,1,1]}
      colors={[""]}
      fields={[
        [{ type: "t", text: "Suspicious login from Russia detected" }, { type: "t", text: "High" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "1:15:00 PM" }],
        [{ type: "t", text: "Malware signature found on ATM endpoint" }, { type: "t", text: "Medium" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "12:50:00 PM" }],
        [{ type: "t", text: "Multiple failed login attempts" }, { type: "t", text: "Low" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "12:30:00 PM" }],
        [{ type: "t", text: "Unusual outbound traffic detected" }, { type: "t", text: "Medium" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "12:10:00 PM" }],
        [{ type: "t", text: "Phishing domain blocked" }, { type: "t", text: "Low" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "11:50:00 AM" }],
        [{ type: "t", text: "Ransomware signature detected" }, { type: "t", text: "High" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "11:30:00 AM" }],
        [{ type: "t", text: "Privilege escalation attempt detected" }, { type: "t", text: "High" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "10:45:00 AM" }],
        [{ type: "t", text: "Brute-force attack detected" }, { type: "t", text: "Medium" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "10:20:00 AM" }],
        [{ type: "t", text: "Suspicious file upload detected" }, { type: "t", text: "Low" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "9:55:00 AM" }],
        [{ type: "t", text: "Unauthorized access attempt blocked" }, { type: "t", text: "High" }, { type: "t", text: "8/9/2025" }, { type: "t", text: "9:30:00 AM" }]
      ]}
      
    />)
}

export default Threats