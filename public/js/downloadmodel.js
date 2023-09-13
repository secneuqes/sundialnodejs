async function downloadSTL() {
    try {
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
            console.log("download complete.")
        });
    } catch (error) {
        console.error('Error downloading STL:', error);
    }
}

function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

