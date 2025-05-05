#define BLYNK_TEMPLATE_ID "TMPL6T9UNvTqc"
#define BLYNK_TEMPLATE_NAME "Projectkan Smartlock"
#define BLYNK_FIRMWARE_VERSION "0.1.0"

#define BLYNK_PRINT Serial
#define APP_DEBUG

#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ESP32Servo.h>
#include "BlynkEdgent.h"

// === Pin Config ===
#define SS_PIN    21     // Pin SDA RFID (sesuaikan dengan wiring ESP32 kamu)
#define RST_PIN   22     // Pin RST RFID
#define RELAY_PIN 26     // Pin relay (untuk buka kunci)
#define SERVO_PIN 27     // Pin servo motor

// === Inisialisasi ===
MFRC522 rfid(SS_PIN, RST_PIN);
Servo myServo;

byte validUIDs[][4] = {
  {0x65, 0xFC, 0xC1, 0x01},  // UID kartu 1
  {0x95, 0x99, 0x33, 0x03}   // UID kartu 2
};
const int totalUIDs = sizeof(validUIDs) / sizeof(validUIDs[0]);

void setup() {
  Serial.begin(115200);
  delay(100);

  BlynkEdgent.begin();

  SPI.begin();            // Mulai SPI
  rfid.PCD_Init();        // Inisialisasi modul RFID
  Serial.println("📡 RFID siap!");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  myServo.attach(SERVO_PIN);
  myServo.write(0); // posisi terkunci

  Serial.println("🚀 Sistem Siap.");
}

void loop() {
  BlynkEdgent.run();

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  Serial.print("UID Terdeteksi: ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();

  if (isAuthorized(rfid.uid.uidByte, rfid.uid.size)) {
    unlockDoor();
    Blynk.virtualWrite(V0, "✅ Akses Diterima");
  } else {
    Serial.println("❌ Akses Ditolak");
    Blynk.virtualWrite(V0, "❌ Akses Ditolak");
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  delay(1000);
}

bool isAuthorized(byte *uid, byte uidSize) {
  for (int i = 0; i < totalUIDs; i++) {
    if (memcmp(uid, validUIDs[i], uidSize) == 0) {
      return true;
    }
  }
  return false;
}


void unlockDoor() {
  Serial.println("🔓 Membuka kunci...");

  digitalWrite(RELAY_PIN, HIGH);
  myServo.write(90);

  Blynk.virtualWrite(V1, 1);

  delay(5000);

  digitalWrite(RELAY_PIN, LOW);
  myServo.write(0);

  Blynk.virtualWrite(V1, 0);

  Serial.println("🔒 Terkunci kembali.");
}
