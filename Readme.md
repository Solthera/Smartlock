# 🔐 Smart Lock System with ESP32 + RFID + Relay + Servo + Blynk

This project is a smart lock system built using ESP32, RFID (RC522), a relay module, a servo motor, and integrated with Blynk for monitoring access.

---

## ⚙️ Components

- ESP32 (WROOM Devkit)
- RFID Reader RC522
- Relay Module (1 channel)
- SG90 Servo Motor (or similar)
- 12V Door Lock (optional)
- Jumper Wires
- Power Supply (e.g. 5V 2A)

---

## 🧠 Wiring Diagram

| Component     | ESP32 Pin     | Notes                    |
|---------------|---------------|--------------------------|
| RC522 SDA     | GPIO 21       | SS Pin                  |
| RC522 SCK     | GPIO 18       | SPI Clock               |
| RC522 MOSI    | GPIO 23       | SPI MOSI                |
| RC522 MISO    | GPIO 19       | SPI MISO                |
| RC522 RST     | GPIO 22       | Reset pin               |
| RC522 3.3V    | 3.3V           | Power (⚠️ not 5V!)      |
| RC522 GND     | GND            | Ground                  |
| Servo Signal  | GPIO 27       | PWM control             |
| Servo VCC     | 5V (external) | Don't power from ESP32  |
| Servo GND     | GND            | Ground (shared)         |
| Relay IN      | GPIO 26       | Control pin             |
| Relay VCC     | 5V             | Power                   |
| Relay GND     | GND            | Ground                  |

---

## 🛠 Notes

- Use a **common GND** between ESP32, Servo, and Relay.
- Servo should be powered via **external 5V source**, not directly from ESP32 to prevent brownout.
- Relay can control 12V electronic lock or magnetic lock depending on use case.
- Make sure your RFID card's UID is added to the code (`masterUID[]`).

---

## 📱 Blynk Integration

- Create a Blynk template and use `BLYNK_TEMPLATE_ID` and `BLYNK_TEMPLATE_NAME`.
- Virtual pins used:
  - `V0`: Access log/status
  - `V1`: Lock state (1 = open, 0 = locked)

---

## ✅ Status

- [x] RFID authentication
- [x] Servo unlock mechanism
- [x] Relay control
- [x] Blynk access status
- [ ] Blockchain integration (next step)

---

Feel free to fork or customize the wiring based on your module pinout!
