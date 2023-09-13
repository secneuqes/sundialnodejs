async function downloadSTL() {
    try {
        $('#ok-btn').attr('disabled', true);
        $(".loader-spinner").removeClass('visually-hidden');
        $(".loader-text").removeClass('visually-hidden');
        $(".file-icon-large").addClass('visually-hidden');
        $(".file-icon-text").addClass('visually-hidden');
        console.log("download clicked. starting rendering.");
        const url = new URL(window.location.href);
        const urlParams = url.searchParams;
        const latInfo = urlParams.get('latitude');
        const declInfo = urlParams.get('decl');
        await fetch(`/api/modelinfo`, { // GET 요청 보낼 때는 ?latitude=${urlParams.get('latitude')}&decl=${urlParams.get('decl')}
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({
                latitude: latInfo,
                decl: declInfo
            })
        }).then((response) => { 
            if(response.ok){
                return response.text();
            } else {
                throw new Error();
            }
         })
        .then((text) => {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', 'angbuilgu.stl');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            console.log("download complete.");
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
        });
    } catch (error) {
        console.error('Error downloading STL:', error);
    }
}

function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

