const jscad = require('@jscad/modeling')
const { cube, sphere, cylinder, circle, cylinderElliptic, cuboid } = jscad.primitives
const { subtract, union } = jscad.booleans
const { rotate, translate, center } = jscad.transforms
const { extrudeLinear } = jscad.extrusions
const { hullChain } = jscad.hulls
const { vectorText } = jscad.text
const { degToRad } = jscad.utils

const fs = require('fs');
const io = require('@jscad/io');


const latitude = 37.49195;
const declination = -8.89144;
const lineThickness = 0.13;

const rightAscension = [-16.6, -11.7, -6.1, 0, 6.1, 11.7, 16.6, 22.3, 22.7, 23.5, 22.7, 20.3, 16.6, 11.7, 6.1, 0, -6.1, -11.7, -16.6, -20.3, -22.7, -23.5, -22.7, -20.3]; // 24절기

const main = () => {
    const result = (
        union(
            angle(),
            legs(),
            subtract(
                body(),
                union(
                    dec(),
                    season(),
                    hour(),
                    minute()
                )
            )
        )
    );
    const rawData = io.stlSerializer.serialize({ binary: false }, result);
    const text = rawData[0];
    console.log("jscad geometry created!");
    fs.writeFileSync('cube.stl', text);
}

const body = () => {
    return subtract(
        union(
            subtract(
                subtract(
                    sphere({ radius: 20 }),
                    translate([0, 0, 20], cube({ size: 40 }))
                ),
                sphere({ radius: 19 })
            ),
            translate([0, 0, -0.5],
                subtract(
                    union(
                        translate([0, 0, 0], cylinder({ radius: 25, height: 0.5 })),
                        NStext()
                    ),
                    sphere({ radius: 19 })
                )
            )
        ),
        translate([-lineThickness / 2, 0, 0.5],
            cuboid({ size: [lineThickness, 40, 1] })
        )
    )
}

const legs = () => {
    return union(
        translate([0, 22.7, -12],
            cylinderElliptic({ height: 24, startRadius: [0.8, 0.8], endRadius: [2.2, 2.2] })
        ),
        translate([-Math.sqrt(386.4765), -11.35, -12],
            cylinderElliptic({ height: 24, startRadius: [0.8, 0.8], endRadius: [2.2, 2.2] })
        ),
        translate([Math.sqrt(386.4765), -11.35, -12],
            cylinderElliptic({ height: 24, startRadius: [0.8, 0.8], endRadius: [2.2, 2.2] })
        ),
    )
}

const angle = () => {
    let newLat, yMove, zMove;
    if (latitude < 0) {
        newLat = 270 + latitude;
        yMove = 19 * Math.cos(degToRad(latitude)) / 2;
        zMove = 19 * Math.sin(degToRad(latitude)) / 2;
    } else {
        newLat = 90 + latitude;
        yMove = -19 * Math.cos(degToRad(latitude)) / 2;
        zMove = -19 * Math.sin(degToRad(latitude)) / 2;
    }
    return translate([0, yMove, zMove],
        rotate([degToRad(newLat), 0, 0],
            cylinderElliptic({ height: 19, startRadius: [0.2, 0.2], endRadius: [2, 2] })
        )
    )
}

const time = (m) => {
    return rotate([degToRad(latitude), 0, 0],
        rotate([0, degToRad(m), 0],
            cylinder({ height: lineThickness, radius: 19.5 })
        )
    )
}

const season = () => {
    let result, temp;
    for (let i = 0; i < 24; i++) {
        if (i === 0) {
            result = translate([0, 19 * Math.sin(degToRad(rightAscension[i])) * Math.cos(degToRad(latitude)), 19 * Math.sin(degToRad(rightAscension[i])) * Math.sin(degToRad(latitude))],
                rotate([-degToRad(90 - latitude), 0, 0],
                    cylinder({ height: lineThickness, radius: 19.5 * Math.cos(degToRad(rightAscension[i])) })
                )
            )
        } else {
            temp = translate([0, 19 * Math.sin(degToRad(rightAscension[i]) * Math.cos(degToRad(latitude))), 19 * Math.sin(degToRad(rightAscension[i])) * Math.sin(degToRad(latitude))],
                rotate([-degToRad(90 - latitude), 0, 0],
                    cylinder({ height: lineThickness, radius: 19.5 * Math.cos(degToRad(rightAscension[i])) })
                )
            )
            result = union(result, temp)
        }
    }

    return subtract(
        result,
        translate([0, 0, 20], cube({ size: 40 })) // 여기는 선택적으로 삭제 가능.
    )
}

const hour = () => {
    let timeSum, temp;
    for (let i = 0; i <= 180; i += 15) {
        if (i === 0) {
            timeSum = time(i)
        } else {
            temp = time(i)
            timeSum = union(timeSum, temp)
        }
    }
    return subtract(
        timeSum,
        translate([0, 0, 20], cube({ size: 40 }))
    )
}

// TODO: faster minute function

const minute = () => {
    const timeSum = [];
    for (let i = 0; i <= 180; i += 15 / 4) {
        timeSum.push(time(i))
    }
    const sub = union(
        rotate([degToRad(90 + latitude), 0, 0], cylinder({ height: 40, radius: 17.5 })),
        rotate([-degToRad(90 - latitude), 0, 0], cylinder({ height: 40, radius: 17.5 })),
        translate([0, 0, 20], cube({ size: 40 })),
    )
    return timeSum.map((time) => subtract(time, sub))
}

const dec = () => {
    return translate([0, 0, 0.5],
        rotate([0, 0, -degToRad(declination)],
            cuboid({ size: [lineThickness, 50, 1] }
            ))
    )
}

// extra functions

const NStext = () => {
    return extrudeLinear({ height: 1 },
        subtract(
            circle({ radius: 25 }),
            center({ axes: [true, true, false] },
                union(
                    buildFlatText("N", 1.3, 0.15, 0, 22),
                    buildFlatText("S", 1.3, 0.15, 0, -22),
                )
            )
        )
    )
}

const buildFlatText = (input, height, radius, x, y) => {
    const lineCorner = circle({ radius })
    const lineSegmentPointArrays = vectorText({ xOffset: x, yOffset: y, height, input }) // line segments for each character
    const lineSegments = []
    lineSegmentPointArrays.forEach((segmentPoints) => { // process the line segment
        const corners = segmentPoints.map((point) => translate(point, lineCorner))
        lineSegments.push(hullChain(corners))
    })
    return union(lineSegments)
}


main();
// module.exports = main;
// module.exports = { main };