/**
 * makecode HT16K33 led backpack Package
 */

enum HT16K33_I2C_ADDRESSES {
    //% block="0x70 (Default)"
    ADD_0x70 = 0x70,
    //% block="0x71"
    ADD_0x71 = 0x71,
    //% block="0x72"
    ADD_0x72 = 0x72,
    //% block="0x73"
    ADD_0x73 = 0x73,
    //% block="0x74"
    ADD_0x74 = 0x74,
    //% block="0x75"
    ADD_0x75 = 0x75,
    //% block="0x76"
    ADD_0x76 = 0x76,
    //% block="0x77"
    ADD_0x77 = 0x77,
}

enum HT16K33_COMMANDS {
    TURN_OSCILLATOR_ON = 0x21,
    TURN_DISPLAY_ON = 0x81,
    SET_BRIGHTNESS = 0xE0
}

enum HT16K33_CONSTANTS {
    DEFAULT_ADDRESS = HT16K33_I2C_ADDRESSES.ADD_0x70,
    MAX_BRIGHTNESS = 15,
    MAX_BLINK_RATE = 3
}

/**
 * HT16K33 block
 */
//% weight=100 color=#00a7e9 icon="\uf26c" block="HT16K33"
namespace ht16k33 {
    let matrixAddress = 0;

    function sendCommand(command: HT16K33_COMMANDS) {
        let buf = pins.createBuffer(2)

        pins.i2cWriteNumber(
            matrixAddress,
            0,
            NumberFormat.Int8LE,
            false

        )
        pins.i2cWriteNumber(
            matrixAddress,
            command,
            NumberFormat.Int8LE,
            false
        )
    }

    //% blockId="HT16K33_RENDER_BITMAP" block="render bitmap %bitmap"
    export function render(bitmap: number[]) {
        const formattedBitmap = formatBimap(bitmap)
        let buff = pins.createBufferFromArray(formattedBitmap);
        pins.i2cWriteBuffer(matrixAddress, buff, false);
    }

    function rotate(value: number) {
        return (value >> 1) | (value << 7);
    }

    function formatBimap(bitmap: Array<number>) {
        const formattedBitmap: Array<number> = [0];

        bitmap.forEach(function (i) {
            formattedBitmap.push(rotate(i));
            //Since the 8x8 Matrix chip can render on an 16x8 screen we have to write an empty byte
            formattedBitmap.push(0);
        });

        return formattedBitmap;
    }

    function initializeDisplay() {
        sendCommand(HT16K33_COMMANDS.TURN_OSCILLATOR_ON)
        sendCommand(HT16K33_COMMANDS.TURN_DISPLAY_ON)
        setBrightness(15);
    }
    //% blockId="HT16K33_SET_ADDRESS" block="set address %address"
    export function setAddress(address: HT16K33_I2C_ADDRESSES) {
        if (matrixAddress != address) {
            matrixAddress = address;
            initializeDisplay();
        }
    }

    //% blockId="HT16K33_SET_BRIGHTNESS" block="set brightness %brightness"
    //% brightness.min=0 brightness.max=15
    export function setBrightness(brightness: number) {
        sendCommand(HT16K33_COMMANDS.SET_BRIGHTNESS | brightness & HT16K33_CONSTANTS.MAX_BRIGHTNESS);
    }
    //% blockId="HT16K33_SET_BLINK_RATE" block="set blink rate %rate"
    //% rate.min=0 rate.max=3
    export function setBlinkRate(rate: number) {
        sendCommand(HT16K33_COMMANDS.TURN_DISPLAY_ON | (rate & HT16K33_CONSTANTS.MAX_BLINK_RATE) << 1);
    }
}
