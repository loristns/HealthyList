// @ts-nocheck

Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('cam')
        },
        decoder: {
            readers: ["ean_reader"]
        }
    },
    function (err) {
        if (err) {
            console.error('This happened :', err);
            return;
        }
    
        Quagga.onDetected((data) => {
            document.getElementById('answer').innerHTML = JSON.stringify(data)
        });
        Quagga.start();
    }
);