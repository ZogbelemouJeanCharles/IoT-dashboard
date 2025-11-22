const int digitalPins[14] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13};
const int analogPins[6] = {A0, A1, A2, A3, A4, A5};

#define numDigitalPins (sizeof(digitalPins)/sizeof(digitalPins[0]))
#define numAnalogPins  (sizeof(analogPins)/sizeof(analogPins[0]))

int totallPins[numDigitalPins + numAnalogPins];

void setup() {
  Serial.begin(9600);

  int index = 0;

  // combine digital pins
  for (int i = 0; i < numDigitalPins; i++) {
    totallPins[index++] = digitalPins[i];
    pinMode(digitalPins[i], INPUT);
  }

  // combine analog pins
  for (int i = 0; i < numAnalogPins; i++) {
    totallPins[index++] = analogPins[i];
    pinMode(analogPins[i], INPUT);
  }
}

void loop() {
  readPins(totallPins, numDigitalPins + numAnalogPins);
  delay(5000);
}



void readPins(int arrPins[], int size) {
  String json = "{id: 01, data: [";

  for (int i = 0; i < size; i++) {
    int pin = arrPins[i];
    bool isDigital = (pin < A0);
    int value = isDigital ? digitalRead(pin) : analogRead(pin);

    json += "{\"pin\":\"" + String(pin) + "\",";
    json += "\"value\":\"" + String(value) + "\",";
    json += "\"isDigital\":" + String(isDigital ? "true" : "false") + "}";

    if (i < size - 1) {
      json += ",";
    }
  }

  json += "]}";

  Serial.println(json);
  delay(1000);
}
