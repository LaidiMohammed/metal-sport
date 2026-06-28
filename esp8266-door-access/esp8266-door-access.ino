/*
 * Metal Sport Gym — Door Access Controller (ESP8266)
 * 
 * Reçoit un POST du webhook → actionne un relais/servo pour ouvrir la porte
 * 
 * Branchement :
 *   - D1 (GPIO5) → relais (NO/COM) ou servo (signal)
 *   - Alimentation 5V via adaptateur mural
 * 
 * Configuration :
 *   1. Mets ton WiFi SSID + password
 *   2. Optionnel : change le PIN_RELAY si besoin
 *   3. Flash sur l'ESP8266
 *   4. Dans l'appli Admin → Scanner → "Webhook URL" :
 *      http://<IP_ESP8266>/open
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// ═══ CONFIGURATION ═══════════════════════════════════════
const char* WIFI_SSID     = "TON_WIFI_SSID";
const char* WIFI_PASSWORD = "TON_WIFI_PASSWORD";

const int PIN_RELAY = 5;           // D1 = GPIO5
const int DOOR_OPEN_MS = 3000;     // temps d'ouverture (ms)
// ═════════════════════════════════════════════════════════

ESP8266WebServer server(80);

void openDoor() {
  digitalWrite(PIN_RELAY, HIGH);   // active le relais
  delay(DOOR_OPEN_MS);
  digitalWrite(PIN_RELAY, LOW);    // désactive
}

void handleOpen() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  openDoor();

  server.send(200, "application/json", "{\"status\":\"ok\",\"message\":\"Door opened\"}");
}

void handleRoot() {
  server.send(200, "text/html",
    "<h1>Metal Sport Gym — Door Access</h1>"
    "<p>ESP8266 ready.</p>"
    "<form method='POST' action='/open'>"
    "<button type='submit' style='padding:20px 40px;font-size:24px;background:#00d4aa;color:#000;border:none;border-radius:12px;cursor:pointer'>"
    "OPEN DOOR</button></form>"
  );
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELAY, OUTPUT);
  digitalWrite(PIN_RELAY, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, handleRoot);
  server.on("/open", HTTP_POST, handleOpen);

  server.begin();
  Serial.println("Server started");
}

void loop() {
  server.handleClient();
}
