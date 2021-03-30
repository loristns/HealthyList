// @ts-nocheck

function initCam() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#cam')    // Or '#yourElement' (optional)
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
    });

    Quagga.onDetected((data) => {
        console.log(data);
        document.getElementById("answer").innerHTML = data;
    });
    Quagga.start();
}


initCam();
