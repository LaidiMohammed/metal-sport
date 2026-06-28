# ESP8266 Door Access Controller

## Branchement
| ESP8266 | Relais/Servo |
|---------|-------------|
| D1 (GPIO5) | Signal (IN) |
| 3.3V/VCC | VCC |
| GND | GND |

**Relais** : NO (Normal Open) → serrure électrique, COM → alimentation serrure

## Installation
1. Ouvre `esp8266-door-access.ino` dans l'IDE Arduino
2. Ajoute le board ESP8266 (Fichier → Préférences → URL: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`)
3. Configure ton WiFi (SSID + password) dans le code
4. Flash sur l'ESP8266
5. Ouvre le moniteur série → note l'IP affichée

## Configuration dans l'appli
- Admin → Scanner QR → section "Contrôle d'accès"
- Webhook URL : `http://<IP_ESP8266>/open`
- Clique "Sauvegarder"

## Test
- Scan un QR code valide → la porte s'ouvre automatiquement
- Ou clique "Ouvrir porte" dans l'admin
