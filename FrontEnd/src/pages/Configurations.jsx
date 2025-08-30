import React from 'react'
import CardSlider from '../components/CardSlider'
function Configurations() {
  return (
    <>
      <CardSlider
        caption={{ text: "Configurations", icon: "faGear" }}
        titles={["key", "value", "action"]}
        sizes={[1,1,1]}
        colors={["#ffffff","","#29B6F6"]}

        fields={[
          [
            { type: "t", text: "sessionTimeout" },
            { type: "t", text: "30" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "maxLoginAttempts" },
            { type: "t", text: "5" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "passwordPolicy" },
            { type: "t", text: "min8chars,1upper,1number" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "emailNotifications" },
            { type: "t", text: "enabled" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "twoFactorAuth" },
            { type: "t", text: "enabled" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "dataRetentionDays" },
            { type: "t", text: "365" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "passwordExpiryDays" },
            { type: "t", text: "90" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "accountLockoutDuration" },
            { type: "t", text: "15min" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "ipWhitelist" },
            { type: "t", text: "192.168.0.0/24" },
            { type: "i", text: "faPen" }
          ],
          [
            { type: "t", text: "apiRateLimit" },
            { type: "t", text: "1000req/min" },
            { type: "i", text: "faPen" }
          ]
        ]}
        
      />
    </>
  )
}

export default Configurations