Servo FLOOR_SELECTOR;
Servo BELL;

int lights[] = {D0, D1, D2, D3, D4, D5};
int locationMap[] = {155, 115, 65, 20};
int button = D6;


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
        BELL.write(165);
        delay(500);
        BELL.write(125);
        delay(500);
    }
}

void reset()
{
    for(int i=0; i<6; i++)
    {
        digitalWrite(lights[i], 0);
    }
    FLOOR_SELECTOR.write(88);
}


void setup()
{
    FLOOR_SELECTOR.attach(A0);
    BELL.attach(A4);

    pinMode(button,INPUT);

    FLOOR_SELECTOR.write(88);
    delay(500);
    BELL.write(125);

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
        foodAndFloor(D1, 115);

        BELL.write(165);
        delay(150);
        BELL.write(125);
        delay(150);

        BELL.write(165);
        delay(300);
        BELL.write(125);
        delay(150);

        delay(3000);

        reset();
    }
}
