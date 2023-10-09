// bundling 방법은 .../js 디렉토리로 들어가서 아래의 명령어를 실행한다.
// 그전에 기존의 bundle.js 는 삭제하길 바람.
// browserify downloadmodelDev.js -o bundle.js
// 제작된 해당 bundle.js 파일이 html 과 연결되어 실행될 파일이다.

$.lang = {};

$.lang.ko = {
    1: "앙부일구",
    2: "페이지",
    3: "3D 모델 제작",
    4: "학습하기",
    5: "확장 기능",
    6: "개발자",
    7: "기타",
    8: "3D 모델 다운로드",
    9: "파일을 다운로드 받아 3D 프린터로 출력해보세요!",
    10: `<i class="bi bi-download me-1"></i>다운로드`,
    11: "자주 묻는 질문",
    12: "프린터 최소 사양은 어떻게 되나요?",
    13: `연구를 진행하며 <strong>Sindoh DP 202, DP 102, 2X</strong>급 사양의 프린터에서 정상적으로 인쇄가 가능함을 확인하였습니다.<br>
    프린터 최소 사양의 결정 조건으로 <strong>노즐 두께</strong>가 가장 중요합니다. 절기선과 시간선 간격보다 노즐 두께가 더 크면 프린팅이 어려울 수 있습니다.
    연구에 사용한 옵션은 DP 202 프린터로 직경 18cm 크기에 노즐 두께 0.2mm 입니다.`,
    14: "어떤 크기로 출력해야 하나요?",
    15: `노즐의 두께에 따라 다르나, 정상적인 실험을 위해서 지평환의 <strong>직경이 16cm 이상</strong>이 되도록 출력하는 것을 권장합니다.<br>
    <small class="text-muted">(노즐 두께 0.2mm 기준입니다.)</small>`,
    16: "출력한 후, 무엇을 확인해야 하나요?",
    17: `출력한 후, 정상적인 출력이 완료되었는지 확인하기 위해 아래의 3개의 조건을 모두 충족하는지 확인해주세요.<br><br>
    <strong>
    1. 수평이 맞는 평평한 바닥에 앙부일구를 올려놓고, 지평환의 수평을 확인했을 때 수평이 맞아야 합니다.<br>
    2. 절기선의 개수가 총 13개로 모두 명확하게 음각 출력이 되었어야 합니다.<br>
    3. 영침의 끝으로 갈수록 휘지 않고 곧게 출력 되어야 합니다.<br><br>
    </strong>
    위의 3개의 조건을 만족하지 않는 경우에는 다시 출력하여 실험하는 것을 권장합니다. 그렇지 않을 경우 실험에 오차가 발생할 수 있습니다.`
}

$.lang.en = {
    1: "Angbuilgu",
    2: "Pages",
    3: "Render 3D Model",
    4: "Learn",
    5: "Extensions",
    6: "Developers",
    7: "Others",
    8: "Download 3D Model",
    9: "Download the file and try printing it with a 3D printer!",
    10: `<i class="bi bi-download me-1"></i>Download`,
    11: "FAQ",
    12: "What are the minimum specifications for the printer?",
    13: `During the research, it was confirmed that printing can be done successfully with printers of specifications equivalent to <strong>Sindoh DP 202, DP 102, and 2X.</strong><br>
    Among the determining factors for the minimum printer specifications, <strong>the nozzle thickness</strong> is the most crucial. If the nozzle thickness is greater than the gap between contour lines and time lines, printing can become challenging.
    The option used in the research was a DP 202 printer with a nozzle thickness of 0.2mm on a 18cm diameter size.`,
    14: "What size should it be printed at?",
    15: `It is recommended to print with a <strong>diameter of 16cm or larger</strong> for proper experimentation, which may vary depending on the nozzle thickness.<br>
    <small class="text-muted">(Based on a nozzle thickness of 0.2mm.)</small>`,
    16: "After printing, what should you check?",
    17: `After printing, please check if all three of the following conditions are met to ensure a successful print:<br><br>
    <strong>
    1. Place the Angbuilgu on a flat, level surface, and when checking the horizon's level, it should be perfectly horizontal.<br>
    2. There should be a total of 13 equidistant solstice lines, clearly indicating negative angles.<br>
    3. As you move towards the tip of the shadow, it should print straight without bending.<br><br>
    </strong>
    If any of the above three conditions are not met, it is recommended to reprint and retry the experiment. Otherwise, it may introduce errors into the experiment.`
}


$(document).ready(function () {
    let lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguageCookie('ko')
        setLanguage('ko');
    }
});


const setLanguage = (currentLanguage) => {
    $('[data-langnum]').each(function () {
        $(this).html($.lang[currentLanguage][$(this).data('langnum')]);
    });
}

$('.lang-select').on('click', function () {
    const changedLang = $(this).data('lang');
    setLanguageCookie(changedLang);
    setLanguage(changedLang);
});

const setLanguageCookie = (lang) => {
    document.cookie = `lang=${lang}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

const getLanguageCookie = () => {
    let value = document.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}

// jquery

$('#ok-btn').click(() => {
    $('#ok-btn').attr('disabled', true);
    $(".loader-spinner").removeClass('visually-hidden');
    $(".loader-text").removeClass('visually-hidden');
    $(".file-icon-large").addClass('visually-hidden');
    $(".file-icon-text").addClass('visually-hidden');
    setTimeout(function () {
        downloadSTL();
    }, 50);
})

const downloadSTL = async () => {
    try {
        console.log("download clicked. starting rendering.");
        const url = new URL(window.location.href);
        const urlParams = url.searchParams;
        const latInfo = urlParams.get('latitude');
        const declInfo = urlParams.get('decl');
        const text = await main(latInfo, declInfo);

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'angbuilgu.stl');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        $(".loader-spinner").addClass('visually-hidden');
        $(".loader-text").addClass('visually-hidden');
        $(".success-icon").removeClass('visually-hidden');
        $(".success-icon-text").removeClass('visually-hidden');
        $(".success-icon").html(`<div class="success-icon__tip"></div>
            <div class="success-icon__long"></div>`);
        $('#ok-btn').attr('disabled', true);
        $('#ok-btn').html('완료');
        $('.btn-group-b').append(`
            <button id="gohome-btn" class="btn btn-dark flex-shrink-0 ms-3" type="button"
                onclick="window.location.href = './'">
                <i class="bi bi-house-door"></i>
                메인 페이지
            </button>`);
        $('#ok-btn').css('background-color', '#4BB543');
        $('#ok-btn').css('border-color', '#4BB543');
        console.log("download complete.");
    } catch (error) {
        console.error('Error downloading STL:', error);
        alert("오류가 발생하였습니다. 새로고침 후에 다시 시도해주세요.");
    }
}

const searchParam = (key) => {
    return new URLSearchParams(location.search).get(key);
};

// JSCAD

const jscad = require('@jscad/modeling');
const io = require('@jscad/io');
const { cube, sphere, cylinder, circle, cylinderElliptic, cuboid } = jscad.primitives;
const { subtract, union } = jscad.booleans;
const { rotate, translate, center } = jscad.transforms;
const { extrudeLinear } = jscad.extrusions;
const { hullChain } = jscad.hulls;
const { vectorText } = jscad.text;
const { degToRad } = jscad.utils;

let latitude, declination;
const lineThickness = 0.13;

const rightAscension = [-16.6, -11.7, -6.1, 0, 6.1, 11.7, 16.6, 22.3, 22.7, 23.5, 22.7, 20.3, 16.6, 11.7, 6.1, 0, -6.1, -11.7, -16.6, -20.3, -22.7, -23.5, -22.7, -20.3]; // 24절기

const main = async (lat, decl) => {
    latitude = parseInt(lat);
    declination = parseInt(decl);
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
    console.log("file size: " + String(parseInt(text.length)) + ' B');
    return text;
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
        translate([0, 0, 20], cube({ size: 40 }))
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
    const lineSegmentPointArrays = vectorText({ xOffset: x, yOffset: y, height, input })
    const lineSegments = []
    lineSegmentPointArrays.forEach((segmentPoints) => {
        const corners = segmentPoints.map((point) => translate(point, lineCorner))
        lineSegments.push(hullChain(corners))
    })
    return union(lineSegments)
}