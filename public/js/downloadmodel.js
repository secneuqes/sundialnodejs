async function downloadSTL() {
    try {
        const response = await fetch('/api/modelBlob', {
            method: 'GET',
        });
        console.log("hi")

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a temporary <a> element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cube.stl'; // Specify the desired filename
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            console.error('Error downloading STL:', response.statusText);
        }
    } catch (error) {
        console.error('Error downloading STL:', error);
    }
}

function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

