Servo FLOOR_SELECTOR;
Servo BELL;

int lights[] = {D0, D1, D2, D3, D4, D5};
int locationMap[] = {140, 105, 65, 30};
int neutralAngle = 85;
int button = D6;
int bellMax = 72;
int bellMin = 85;


// Pass in params like 1,3 pin for food then floor
int updateState(String param)
{
    int pinNumber = param[0] - '0';
    int location = param[2] - '0';
    foodAndFloor(lights[pinNumber], locationMap[location-1]);
    ringBellTimes(location);
    delay(15000);
    reset();
    return 1;
}

void foodAndFloor(int foodPin, int degrees)
{
    digitalWrite(foodPin, 1);
    FLOOR_SELECTOR.write(degrees);
}

void ringBellTimes(int occ)
{
    for(int i=0; i<occ; i++)
    {
        BELL.write(bellMax);
        delay(500);
        BELL.write(bellMin);
        delay(500);
    }
}

void reset()
{
    for(int i=0; i<6; i++)
    {
        digitalWrite(lights[i], 0);
    }
    FLOOR_SELECTOR.write(neutralAngle);
}


void setup()
{
    FLOOR_SELECTOR.attach(A0);
    BELL.attach(A1);

    pinMode(button,INPUT);

    FLOOR_SELECTOR.write(neutralAngle);
    delay(500);
    BELL.write(bellMin);

    for(int i=0; i<6; i++)
    {
        pinMode(lights[i], OUTPUT);
        digitalWrite(lights[i], 1);
    }

    delay(3000);

    for(int i=0; i<6; i++){
        digitalWrite(lights[i], 0);
    }

    Spark.function("updateState", updateState);
}

void loop()
{
    if(digitalRead(button)==1)
    {
        foodAndFloor(lights[2], locationMap[1]);

        BELL.write(bellMax);
        delay(150);
        BELL.write(bellMin);
        delay(150);

        BELL.write(bellMax);
        delay(300);
        BELL.write(bellMin);
        delay(150);

        delay(3000);

        reset();
    }
}
