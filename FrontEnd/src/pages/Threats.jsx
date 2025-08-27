import React from 'react'
import CardSlider from '../components/CardSlider'
function Threats() {
  return (
    <CardSlider
    caption={{text:"Live Threat Feed",icon:"faFileLines"}}
      titles={["description","severity","date","time"]}
      fields={[
        [{ type: "t", text: "Suspicious login from Russia detected", size: 4 }, { type: "t", text: "High", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "1:15:00 PM", size: 1 }],
        [{ type: "t", text: "Malware signature found on ATM endpoint", size: 4 }, { type: "t", text: "Medium", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "12:50:00 PM", size: 1 }],
        [{ type: "t", text: "Multiple failed login attempts", size: 4 }, { type: "t", text: "Low", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "12:30:00 PM", size: 1 }],
        [{ type: "t", text: "Unusual outbound traffic detected", size: 4 }, { type: "t", text: "Medium", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "12:10:00 PM", size: 1 }],
        [{ type: "t", text: "Phishing domain blocked", size: 4 }, { type: "t", text: "Low", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "11:50:00 AM", size: 1 }],
        [{ type: "t", text: "Ransomware signature detected", size: 4 }, { type: "t", text: "High", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "11:30:00 AM", size: 1 }],
      
        // Extra generated fields
        [{ type: "t", text: "Privilege escalation attempt detected", size: 4 }, { type: "t", text: "High", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "10:45:00 AM", size: 1 }],
        [{ type: "t", text: "Brute-force attack detected", size: 4 }, { type: "t", text: "Medium", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "10:20:00 AM", size: 1 }],
        [{ type: "t", text: "Suspicious file upload detected", size: 4 }, { type: "t", text: "Low", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "9:55:00 AM", size: 1 }],
        [{ type: "t", text: "Unauthorized access attempt blocked", size: 4 }, { type: "t", text: "High", size: 1 }, { type: "t", text: "8/9/2025", size: 1 }, { type: "t", text: "9:30:00 AM", size: 1 }]
      ]
      }
    />   )
}

export default Threats