let frown: number[] = []
let meh: number[] = []
let smile: number[] = []
ht16k33.setAddress(HT16K33_I2C_ADDRESSES.ADD_0x70)
smile = [60, 66, 165, 129, 165, 153, 66, 60]
meh = [60, 66, 165, 129, 189, 129, 66, 60]
frown = [60, 66, 165, 129, 153, 165, 66, 60]
forever(function () {
    ht16k33.setBrightness(0)
    ht16k33.render(frown)
    pause(1000)
    ht16k33.setBrightness(7)
    ht16k33.render(meh)
    pause(1000)
    ht16k33.setBrightness(15)
    ht16k33.render(smile)
    pause(1000)
})
