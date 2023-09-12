const downloadStl = async () => {
    const data = await fetch(`/api/modelBlob?latitude=${searchParam('latitude')}&decl=${searchParam('decl')}`);
    console.log(data);
    save(new Blob([data], { type: 'text/plain' }), 'angbuilgu.stl');
}

function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);
const save = (blob, filename) => {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

